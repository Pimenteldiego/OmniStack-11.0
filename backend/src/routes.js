function createRateLimiter() {
    return rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
    });
}
const { Segments, Joi } = require('celebrate');

const sessionSchema = {
    [Segments.BODY]: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        whatsapp: Joi.string().required().min(10).max(11),
        city: Joi.string().required(),
        uf: Joi.string().required().length(2),
    })
};

const profileSchema = {
    [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().required(),
    }).unknown()
};

const incidentSchema = {
    [Segments.BODY]: Joi.object().keys({
        title: Joi.string().required(),
        description: Joi.string().required(),
        value: Joi.number().required(),
    }),
    [Segments.HEADERS]: Joi.object({
        authorization: Joi.string().required(),
    }).unknown()
};

const paramsSchema = {
    [Segments.PARAMS]: Joi.object().keys({
        id: Joi.number().required(),
    })
};

const querySchema = {
    [Segments.QUERY]: Joi.object().keys({
        page: Joi.number(),
    })
};

module.exports = {
    sessionSchema,
    profileSchema,
    incidentSchema,
    paramsSchema,
    querySchema,
};
const express = require('express');
const { celebrate } = require('celebrate');
const { sessionSchema, profileSchema, incidentSchema, paramsSchema, querySchema } = require('./schemas');
const rateLimit = require('express-rate-limit');

const OngController = require('./controllers/OngController');
const IncidentController = require('./controllers/IncidentController');
const ProfileController = require('./controllers/ProfileController');
const SessionController = require('./controllers/SessionController');

const routes = express.Router();

function createRateLimiter() {
    return rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // limit each IP to 100 requests per windowMs
    });
}

routes.post('/sessions', createRateLimiter(), celebrate(sessionSchema), SessionController.create);
routes.get('/ongs', createRateLimiter(), OngController.index);
routes.post('/ongs', createRateLimiter(), celebrate(sessionSchema), OngController.create);
routes.get('/profile', createRateLimiter(), celebrate(profileSchema), ProfileController.index);
routes.get('/incidents', createRateLimiter(), celebrate(querySchema), IncidentController.index);
routes.post('/incidents', createRateLimiter(), celebrate(incidentSchema), IncidentController.create);
routes.delete('/incidents/:id', createRateLimiter(), celebrate(paramsSchema), IncidentController.delete);

module.exports = routes;

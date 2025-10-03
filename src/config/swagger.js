// FR : Importe swagger-jsdoc pour générer la documentation OpenAPI à partir des commentaires JSDoc
// EN : Imports swagger-jsdoc to generate OpenAPI documentation from JSDoc comments
const swaggerJsdoc = require('swagger-jsdoc');

// FR : Options de configuration pour swagger-jsdoc
// EN : Configuration options for swagger-jsdoc
const options = {
  definition: {
    // FR : Spécifie la version d'OpenAPI utilisée
    // EN : Specifies the OpenAPI version used
    openapi: '3.0.3',
    info: {
      // FR : Informations générales sur l’API
      // EN : General information about the API
      title: 'Port Russell API',
      version: '1.0.0',
      description: 'API REST pour la gestion des catways et des réservations',
    },
    // FR : Définit le serveur par défaut (ici localhost:3000 en développement)
    // EN : Defines the default server (here localhost:3000 for development)
    servers: [{ url: 'http://localhost:3000' }],

    // FR : Définition des schémas (modèles de données utilisés par l’API)
    // EN : Definition of schemas (data models used by the API)
    components: {
      schemas: {
        // ---------------------------
        // FR : Modèle Catway complet (lecture/affichage)
        // EN : Full Catway model (read/display)
        Catway: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '68dee4db9912464f8dbeb42d' },
            catwayNumber: { type: 'integer', example: 5 },
            catwayType: { type: 'string', enum: ['long', 'short'], example: 'long' },
            catwayState: { type: 'string', example: 'bon état' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            __v: { type: 'integer' }
          },
          required: ['catwayNumber', 'catwayType', 'catwayState']
        },

        // FR : Données nécessaires pour créer un Catway
        // EN : Input schema for creating a Catway
        CatwayCreateInput: {
          type: 'object',
          required: ['catwayNumber', 'catwayType', 'catwayState'],
          properties: {
            catwayNumber: { type: 'integer', example: 99 },
            catwayType: { type: 'string', enum: ['long', 'short'] },
            catwayState: { type: 'string', example: 'Disponible' }
          }
        },

        // FR : Données pour mettre à jour un Catway (optionnelles)
        // EN : Input schema for updating a Catway (optional fields)
        CatwayUpdateInput: {
          type: 'object',
          properties: {
            catwayType: { type: 'string', enum: ['long', 'short'] },
            catwayState: { type: 'string' }
          }
        },

        // ---------------------------
        // FR : Modèle Reservation complet (lecture/affichage)
        // EN : Full Reservation model (read/display)
        Reservation: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '68df80e94f1656c630d0a1a3' },
            catwayNumber: { type: 'integer', example: 5 },
            clientName: { type: 'string', example: 'Alice' },
            boatName: { type: 'string', example: 'Le Mistral' },
            startDate: { type: 'string', format: 'date', example: '2025-10-10' },
            endDate: { type: 'string', format: 'date', example: '2025-10-12' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            __v: { type: 'integer' }
          },
          required: ['catwayNumber', 'clientName', 'boatName', 'startDate', 'endDate']
        },

        // FR : Données nécessaires pour créer une réservation
        // EN : Input schema for creating a reservation
        ReservationCreateInput: {
          type: 'object',
          required: ['catwayNumber', 'clientName', 'boatName', 'startDate', 'endDate'],
          properties: {
            catwayNumber: { type: 'integer', example: 5 },
            clientName: { type: 'string', example: 'Alice' },
            boatName: { type: 'string', example: 'Le Mistral' },
            startDate: { type: 'string', format: 'date', example: '2025-10-10' },
            endDate: { type: 'string', format: 'date', example: '2025-10-12' }
          }
        },

        // FR : Données pour mettre à jour une réservation (tous les champs optionnels)
        // EN : Input schema for updating a reservation (all fields optional)
        ReservationUpdateInput: {
          type: 'object',
          properties: {
            catwayNumber: { type: 'integer' },
            clientName: { type: 'string' },
            boatName: { type: 'string' },
            startDate: { type: 'string', format: 'date' },
            endDate: { type: 'string', format: 'date' }
          }
        },

        // ---------------------------
        // FR : Modèle d'erreur générique (pour réponses API)
        // EN : Generic error model (for API responses)
        ApiError: {
          type: 'object',
          properties: { error: { type: 'string' } }
        },

        // FR : Modèle pour représenter plusieurs erreurs de validation
        // EN : Model to represent multiple validation errors
        ValidationErrors: {
          type: 'object',
          properties: {
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  msg: { type: 'string' },
                  path: { type: 'string' },
                  location: { type: 'string' }
                }
              }
            }
          }
        }
      }
    }
  },
  // FR : Indique où chercher les fichiers avec des JSDoc pour générer la doc automatiquement
  // EN : Indicates where to look for files with JSDoc to auto-generate documentation
  apis: ['src/routes/*.js'],
};

// FR : Génère la spécification OpenAPI à partir des options
// EN : Generates the OpenAPI specification from the options
const openapiSpec = swaggerJsdoc(options);

// FR : Exporte la spec pour être utilisée par l’app (ex: swagger-ui-express)
// EN : Exports the spec to be used by the app (e.g., swagger-ui-express)
module.exports = { openapiSpec };

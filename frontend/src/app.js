const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const feedbackRoutes = require('./routes/feedbackRoutes');
const actionItemRoutes = require('./routes/actionItemRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/feedback', feedbackRoutes);
app.use('/api/action-items', actionItemRoutes);

// Debug: List all registered routes
app.get('/api/debug/routes', (req, res) => {
    const routes = [];
    app._router.stack.forEach((middleware) => {
        if (middleware.route) {
            routes.push({
                path: middleware.route.path,
                methods: Object.keys(middleware.route.methods)
            });
        } else if (middleware.name === 'router') {
            middleware.handle.stack.forEach((handler) => {
                if (handler.route) {
                    routes.push({
                        path: handler.route.path,
                        methods: Object.keys(handler.route.methods)
                    });
                }
            });
        }
    });
    res.json({ routes });
});

module.exports = app;

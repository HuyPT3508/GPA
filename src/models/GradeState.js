const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

const GradeState = sequelize.define('GradeState', {
    stateData: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: '{}'
    }
});

// Setup relationships
User.hasOne(GradeState, { foreignKey: 'userId', onDelete: 'CASCADE' });
GradeState.belongsTo(User, { foreignKey: 'userId' });

module.exports = GradeState;

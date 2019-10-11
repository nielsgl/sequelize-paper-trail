module.exports = (sequelize, DataTypes) => {
    const Todo = sequelize.define('Todo', { title: DataTypes.STRING });

    // eslint-disable-next-line no-unused-vars
    Todo.associate = models => {
        // associations can be defined here
    };

    Todo.Revision = Todo.hasPaperTrail();

    return Todo;
};

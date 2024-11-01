const { query } = require('express');
const { dbPool } = require('../config/dbConn');

const getAllUsers = async (req, res) => {
    const query = "Select * from users_mysql2";
    let dbConn;

    try{
        dbConn = await dbPool.getConnection();
        const [results] = await dbConn.execute(query);

        res.status(200).send(results);
    } catch(error){
        return res.status(500).send(error);
    } finally {
        if(dbConn){
            await dbConn.release();
        }
    }
}

const getOneUser = async (req, res) => {
    const { id } = req.params;
    if(!id){
        return res.status(400).send("Data missing!");
    }

    const query = "select * from users_mysql2 where id = ?";
    let dbConn;

    try {
        dbConn = await dbPool.getConnection();
        let [result] = await dbConn.execute(query, [id]);

        res.status(200).send(result);
        
    } catch (error) {
        res.status(500).send(error);
    } finally { 
        if(dbConn){
            await dbConn.release();
        }
    }
}

const createUser = async (req, res) => {
    const { firstName, lastName, email, age } = req.body;

    if(!firstName || !lastName || !email || !age){
        return res.status(400).send('Data missing!');
    }

    const query = "insert into users_mysql2 (firstName, lastName, email, age) values (?, ?, ?, ?)";
    let dbConn;

    try{
        dbConn = await dbPool.getConnection();
        const [result] = await dbConn.execute(query, [ firstName, lastName, email, age ]);

        res.status(200).send("User created successfully");

    } catch(error){
        res.status(500).send(error);
    } finally{
        if(dbConn){
            await dbConn.release();
        }
    }
}

const updateUser = async(req, res) => {
    const { id } = req.params;
    const updates = req.body;
    
    if(!id || !updates || Object.keys(updates).length === 0){
        return res.status(400).send("Data incomplete. Cannot update user");
    }

    const setClause = Object.keys(updates)
        .map((update) => `${update} = ?`)
        .join(", ");

    const values = Object.values(updates);

    const query = `update users_mysql2 set ${setClause} where id = ?`;
    let dbConn;

    try{
        dbConn = await dbPool.getConnection();
        const [result] = await dbConn.execute(query, [...values, id]);

        if(result.affectedRows === 0){
            return res.status(404).send("No user found and updated");
        }

        res.status(200).send("User updated successfully");

    } catch(error){
        res.status(500).send(error);
    } finally{
        if(dbConn){
            await dbConn.release();
        }
    }
}

const deleteUser = async (req, res) => {
    const { id } = req.params;
    if(!id){
        return res.status(400).send("User credentials missing");    
    }

    const query = "delete from users_mysql2 where id = ?";
    let dbConn;

    try{
        dbConn = await dbPool.getConnection();

        const [result] = await dbConn.execute(query, [ id ]);
        res.status(200).send("User deleted successfully");

    } catch(error){
        res.status(500).send(error);
    } finally {
        if(dbConn){
            await dbConn.release();
        }
    }
}

module.exports = { getAllUsers, getOneUser, createUser, updateUser, deleteUser };
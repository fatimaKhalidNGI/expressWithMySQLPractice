const { query } = require('express');
const { dbPool } = require('../config/dbConn');

const getAllUsers = async (req, res) => {
    const query = "Select * from users";
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
    const { email } = req.params;
    if(!email){
        return res.status(400).send("Data missing!");
    }

    const query = "select * from users where email = ?";
    let dbConn;

    try {
        dbConn = await dbPool.getConnection();
        let [result] = await dbConn.execute(query, [email]);

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

    const query = "insert into users (firstName, lastName, email, age) values (?, ?, ?, ?)";
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
    const { email } = req.params;
    const updates = req.body;
    
    if(!email || !updates || Object.keys(updates).length === 0){
        return res.status(400).send("Data incomplete. Cannot update user");
    }

    const setClause = Object.keys(updates)
        .map((update) => `${update} = ?`)
        .join(", ");

    const values = Object.values(updates);

    const query = `update users set ${setClause} where email = ?`;
    let dbConn;

    try{
        dbConn = await dbPool.getConnection();
        const [result] = await dbConn.execute(query, [...values, email]);

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
    const { email } = req.params;
    if(!email){
        return res.status(400).send("User credentials missing");    
    }

    const query = "delete from users where email = ?";
    let dbConn;

    try{
        dbConn = await dbPool.getConnection();

        const [result] = await dbConn.execute(query, [ email ]);
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
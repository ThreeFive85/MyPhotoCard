import mysql from 'mysql2/promise';

import { db } from '../config/db.js';

const pool = mysql.createPool(db);

export const getCards = async (req, res) => {

    const connection = await pool.getConnection();

    const unlock = 'unlock';

    // const userEmail = req.email;
    // console.log("userEmail", userEmail);
    const query = 'SELECT cards.id, title, message, tags, selectedFile, createAt, user_id, name, locked '
    +`FROM cards INNER JOIN users on cards.user_id = users.id WHERE locked=?`;

    try {
        // const userId = await connection.query(`select id from users where email=?`, [userEmail]);
        // // console.log(userId[0][0].id)
        const data = await connection.query(query, [unlock]);
        // console.log(data[0])
        if (data[0].length < 1) {
            console.log('카드가 존재하지 않습니다');
        }
        res.status(200).json(data[0]);
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message});
    } finally {
        connection.release();
    }
}

export const getUserCards = async (req, res) => {

    const connection = await pool.getConnection();

    const userEmail = req.userEmail;

    const query = 'SELECT cards.id, title, message, tags, selectedFile, createAt, user_id, name, locked '
    +'FROM cards INNER JOIN users on cards.user_id = users.id where user_id=?'

    try {
        const userId = await connection.query(`select id from users where email=?`, [userEmail]);
        // console.log(userId[0][0].id)
        const data = await connection.query(query, [userId[0][0].id])
        // console.log(data[0])
        if (data[0].length < 1) {
            console.log('해당 유저의 카드가 존재하지 않습니다');
        }
        res.status(200).json(data[0]);
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message});
    } finally {
        connection.release();
    }
}

export const createCard = async (req, res) => {
    const connection = await pool.getConnection();

    const userEmail = req.userEmail;
// console.log("userEmail", userEmail)
    const { title, message, tags, selectedFile } = req.body;

    // console.log(req.body);

    const query = 'SELECT cards.id, title, message, tags, selectedFile, createAt, user_id, name, locked '
    +'FROM cards INNER JOIN users on cards.user_id = users.id where cards.id = ?'

    try {
        const userId = await connection.query(`select id from users where email=?`, [userEmail]);
        // console.log(userId[0][0].id)
        const data = await connection.query('insert into cards set ?', { title: title, message: message,
            tags: tags, selectedFile: selectedFile, locked: 'unlock', createAt: new Date().toISOString().substr(0,10),
            user_id: userId[0][0].id
        });
        const result = await connection.query(query, [data[0].insertId])
        res.status(201).json(result[0][0]);
    } catch (error) {
        console.log(error);
        res.status(409).json({ message: error.message });
    } finally {
        connection.release();
    }
}

export const updateCard = async (req, res) => {
    const connection = await pool.getConnection();

    const { id } = req.params;

    const { title, message, tags, selectedFile } = req.body;

    const query1 = `UPDATE cards SET title=?, message=?, tags=?, selectedFile=? WHERE id= ${id}`

    const query2 = 'SELECT cards.id, title, message, tags, selectedFile, createAt, user_id, name, locked '
    +`FROM cards INNER JOIN users on cards.user_id = users.id where cards.id = ${id}`


    try {

        const [rows, fields] = await connection.execute(query1, [title, message, tags, selectedFile]);
        console.log(rows);

        const result = await connection.execute(query2);

        res.json(result[0][0]);
    } catch (error) {
        console.log(error);
        res.status(409).json({message: error.message});
    } finally {
        connection.release();
    }
}

export const deleteCard = async (req, res) => {
    const connection = await pool.getConnection();

    const { id } = req.params;

    try {
        await connection.execute(`DELETE FROM cards WHERE id = ${id}`)

        res.json({message: '해당 카드가 삭제되었습니다.'})
    } catch (error) {
        console.log(error);
        res.status(409).json({message: error.message});
    } finally {
        connection.release();
    }
}

export const lockCard = async (req, res) => {
    const connection = await pool.getConnection();

    const { id } = req.params;

    const query1 = `UPDATE cards SET locked=? WHERE id= ${id}`;

    const query2 = 'SELECT cards.id, title, message, tags, selectedFile, createAt, user_id, name, locked '
    +`FROM cards INNER JOIN users on cards.user_id = users.id where cards.id = ${id}`


    try {

        const card = await connection.execute(`select * from cards where id=${id}`);

        if(card[0][0].locked === 'unlock'){
            const [rows, fields] = await connection.execute(query1, ['lock']);
            console.log(rows);
        } else {
            const [rows, fields] = await connection.execute(query1, ['unlock']);
            console.log(rows);
        }

        const result = await connection.execute(query2);

        res.json(result[0][0]);
    } catch (error) {
        console.log(error);
        res.status(409).json({message: error.message});
    } finally {
        connection.release();
    }
}
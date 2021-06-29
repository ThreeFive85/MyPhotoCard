import e from 'express';
import mysql from 'mysql2/promise';

import { db } from '../config/db.js';

const pool = mysql.createPool(db);

export const getCards = async (req, res) => {

    const connection = await pool.getConnection();

    const userEmail = req.userEmail;

    try {
        const userId = await connection.query(`select id from users where email=?`, [userEmail]);
        // console.log(userId[0][0].id)
        const data = await connection.query('select * from cards where user_id=?', [userId[0][0].id])
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

    const { title, message, tags, selectedFile } = req.body;

    try {
        const userId = await connection.query(`select id from users where email=?`, [userEmail]);
        // console.log(userId[0][0].id)
        const data = await connection.query('insert into cards set ?', { title: title, message: message,
            tags: tags, selectedFile: selectedFile, createAt: new Date().toISOString().substr(0,10),
            user_id: userId[0][0].id
        });
        const result = await connection.query('select * from cards where id = ?', [data[0].insertId])
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

    const query = `UPDATE cards SET title=?, message=?, tags=?, selectedFile=? WHERE id= ${id}`

    try {

        const [rows, fields] = await connection.execute(query, [title, message, tags, selectedFile]);
        console.log(rows);

        const result = await connection.execute(`select * from cards where id=${id}`);

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
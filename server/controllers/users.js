import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { db } from '../config/db.js';
import { tokenPassword } from '../config/token.js';

const pool = mysql.createPool(db);

export const signup = async(req, res) => { // async, await

    const { name, email, password } = req.body;

    const connection = await pool.getConnection();

    try {
        const existingUser = await connection.query('select email from users where email = '+mysql.escape(req.body.email), {email:email} );
        // console.log(existingUser[0][0])
        if(existingUser[0][0] !== undefined) return res.status(400).json({ message: "존재하는 유저입니다." });

        const hashedPassword = await bcrypt.hash(password, 12);

        const data = await connection.query('insert into users set ?', {
            name: name, 
            email: email, 
            password: hashedPassword, 
        })

        const token = jwt.sign({ email: data.email }, tokenPassword, { expiresIn: "1h"});
        const result = await connection.query('select * from users where id = ? ', [data[0].insertId]);
        const resultData = result[0][0];
        
        res.status(202).json({ token, resultData });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: '서버에러' });
    } finally {
        connection.release()
    }
}

export const signin = async(req, res) => { // async, await
    const { email, password } = req.body;

    const connection = await pool.getConnection();

    try {
        const existingUser = await connection.query('select email, password from users where email = '+mysql.escape(req.body.email), {email:email} );
        // console.log(existingUser[0][0].password)
        if(existingUser[0][0] === undefined) return res.status(404).json({ message: "유저를 찾을 수 없습니다" });

        const isPasswordCorrect = await bcrypt.compare(password, existingUser[0][0].password);

        if(!isPasswordCorrect) return res.status(400).json({ message: "잘못된 암호입니다" });

        const user = existingUser[0][0].email
        //console.log("user", user)

        const token = jwt.sign({ email: user }, tokenPassword, { expiresIn: "1h"});

        res.status(200).json({ result: existingUser[0][0], token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: '서버에러' });
    } finally {
        connection.release()
    }
}
import React, { useState } from 'react'
import { Avatar, Button, Paper, Grid, Typography, Container } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import useStyles from './styles';
import Input from './Input';

import { signin, signup } from '../../actions/auth';

const initialState = { name: '', email: '', password:'', confirmPassword: '' };

function Auth() {
    const classes = useStyles();
    const [showPassword, setShowPassword] = useState(false);
    const [isSignup, setIsSignup] = useState(false);
    const [formData, setFormData] = useState(initialState);

    const dispatch = useDispatch();
    const history = useHistory();

    const handleShowPassword = () => setShowPassword((prevShowPassword) => !prevShowPassword);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        if (isSignup) {
            dispatch(signup(formData, history));
        } else {
            dispatch(signin(formData, history))
        }
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const switchMode = () => {
        setIsSignup((prevIsSignup) => !prevIsSignup);
        setShowPassword(false)
    }

    return (
        <Container component="main" maxWidth="sm">
            <Paper className={classes.paper} elevation={3}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography variant="h5">{isSignup ? '회원가입' : '로그인'}</Typography>
                <form className={classes.form} onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {
                            isSignup && (
                                <>
                                    <Input name="name" label="이름" handleChange={handleChange} type="name" />
                                    {/* <Input name="firstName" label="First Name" handleChange={handleChange} half /> */}
                                </>
                            )
                        }
                        <Input name="email" label="이메일" handleChange={handleChange} type="email" />
                        <Input name="password" label="비밀번호" handleChange={handleChange} type={showPassword ? "text" : "password"} handleShowPassword={handleShowPassword} />
                        { isSignup && <Input name="confirmPassword" label="다시 한번 비밀번호" handleChange={handleChange} type="password" /> }
                    </Grid>
                    <Button type="submit" fullWidth variant="contained" color="primary" className={classes.submit}>
                        {isSignup ? '회원가입' : '로그인'}
                    </Button>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Button onClick={switchMode}>
                                { isSignup ? '기존 유저는 로그인을 부탁드려요' : "이곳이 처음이시면 회원가입을 부탁드려요"}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Container>
    )
}

export default Auth

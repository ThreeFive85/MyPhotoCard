import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';

import useStyles from './styles';
import { createCard, updateCard, getUserCards, getCards } from '../../actions/posts';

// GET THE CURRENT ID

const Form = ({currentId, setCurrentId}) => {
    const [postData, setPostData] = useState({
        title: '',
        message: '',
        tags: '',
        photo: '',
    });
    const post = useSelector((state) => (currentId ? state.posts.find((message) => message.id === currentId) : null));
    const classes = useStyles();
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('profile'));

    useEffect(() => {
        if(post) setPostData(post);
    }, [post]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        // console.log(postData.photo);
        const data = new FormData();

        data.append('photo', postData.photo);
        data.append('title', postData.title);
        data.append('message', postData.message);
        data.append('tags', postData.tags);
        data.append('name', user?.result?.name);
 
        if (currentId) {
            dispatch(updateCard(currentId, {...postData}));
            clear();
        } else {
            dispatch(createCard(data));
            clear();
        }
      };

    const clear = () => {
        setCurrentId(null);
        setPostData({
            title: '',
            message: '',
            tags: '',
            photo: '',
        })
    }
    
    const [isUser, setIsUser] = useState(true);
    const userCards = () => {
        if(isUser){
            dispatch(getUserCards())
            setIsUser((prev) => !prev);
        } else {
            dispatch(getCards());
            setIsUser((prev) => !prev);
        }
    }

    if(!user?.result?.name) {
        return(
            <Paper className={classes.paper}>
                <Typography variant="h6" align="center">
                    ???????????? ?????? ????????? ?????? ????????? ???????????????.
                </Typography>
            </Paper>
        );
    };

    if(currentId) {
        return (
            <Paper className={classes.paper}>
                <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
                    <Typography variant="h6">?????? {currentId ? '??????' : '??????'}</Typography>
                    <TextField name="title" 
                        variant="outlined" 
                        label="??????" 
                        fullWidth
                        required
                        value={postData.title}
                        onChange={(e) => setPostData({
                            ...postData,
                            title: e.target.value
                        })}
                    />
                    <TextField name="message" 
                        variant="outlined" 
                        label="?????????" 
                        fullWidth
                        required
                        multiline
                        rows={4}
                        value={postData.message}
                        onChange={(e) => setPostData({
                            ...postData,
                            message: e.target.value
                        })}
                    />
                    <TextField name="tags" 
                        variant="outlined" 
                        label="?????????" 
                        required
                        fullWidth
                        value={postData.tags}
                        onChange={(e) => setPostData({
                            ...postData,
                            tags: e.target.value
                        })}
                    />
                    <Button className={classes.buttonSubmit} 
                        variant="contained"
                        color="primary"
                        size="large"
                        type="submit"
                        fullWidth >
                            ?????? ??????
                    </Button>
                </form>
            </Paper>
        );
    }

    return (
        <Paper className={classes.paper}>
            <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
                <Typography variant="h6">?????? {currentId ? '??????' : '??????'}</Typography>
                <TextField name="title" 
                    variant="outlined" 
                    label="??????" 
                    fullWidth
                    required
                    value={postData.title}
                    onChange={(e) => setPostData({
                        ...postData,
                        title: e.target.value
                    })}
                />
                <TextField name="message" 
                    variant="outlined" 
                    label="?????????" 
                    fullWidth
                    required
                    multiline
                    rows={4}
                    value={postData.message}
                    onChange={(e) => setPostData({
                        ...postData,
                        message: e.target.value
                    })}
                />
                <TextField name="tags" 
                    variant="outlined" 
                    label="?????????" 
                    required
                    fullWidth
                    value={postData.tags}
                    onChange={(e) => setPostData({
                        ...postData,
                        tags: e.target.value
                    })}
                />
                <div className={classes.fileInput}>
                    <input type="file" name="photo" onChange={(e) => setPostData({
                        ...postData,
                        photo: e.target.files[0] 
                    })} />
                </div>
                <Button className={classes.buttonSubmit} 
                    variant="contained"
                    color="primary"
                    size="large"
                    type="submit"
                    fullWidth >
                        ??????
                </Button>
                <Button className={classes.buttonSubmit} 
                    variant="contained"
                    color="inherit"
                    size="small"
                    onClick={userCards}
                    fullWidth >
                        {isUser ? '??? ?????? ??????' : '?????? ?????? ??????'}
                </Button>
                <Button  
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={clear}
                    fullWidth >
                        ?????????
                </Button>
            </form>
        </Paper>
    );
}

export default Form;
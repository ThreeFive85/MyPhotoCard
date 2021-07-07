import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Paper } from '@material-ui/core';
import FileBase from 'react-file-base64';
import { useDispatch, useSelector } from 'react-redux';


import useStyles from './styles';
import { createCard, updateCard, getUserCards, getCards } from '../../actions/posts';

// GET THE CURRENT ID

const Form = ({currentId, setCurrentId}) => {
    const [postData, setPostData] = useState({
        title: '',
        message: '',
        tags: '',
        selectedFile: '',
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
    // console.log(postData);
        if (currentId) {
            dispatch(updateCard(currentId, { ...postData, name: user?.result?.name }));
            clear();
        } else {
            dispatch(createCard({ ...postData, name: user?.result?.name }));
            clear();
        }
      };

    const clear = () => {
        setCurrentId(null);
        setPostData({
            title: '',
            message: '',
            tags: '',
            selectedFile: '',
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
                    로그인을 하여 당신의 좋은 기억을 남겨주세요.
                </Typography>
            </Paper>
        );
    };

    return (
        <Paper className={classes.paper}>
            <form autoComplete="off" noValidate className={`${classes.root} ${classes.form}`} onSubmit={handleSubmit}>
                <Typography variant="h6">카드 {currentId ? '수정' : '등록'}</Typography>
                <TextField name="title" 
                    variant="outlined" 
                    label="제목" 
                    fullWidth
                    value={postData.title}
                    onChange={(e) => setPostData({
                        ...postData,
                        title: e.target.value
                    })}
                />
                <TextField name="message" 
                    variant="outlined" 
                    label="메세지" 
                    fullWidth
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
                    label="태그들" 
                    fullWidth
                    value={postData.tags}
                    onChange={(e) => setPostData({
                        ...postData,
                        tags: e.target.value
                    })}
                />
                <div className={classes.fileInput}>
                    <FileBase 
                        type="file"
                        multiple={false}
                        onDone={({base64}) => setPostData({ ...postData, selectedFile: base64 })}
                    />
                </div>
                <Button className={classes.buttonSubmit} 
                    variant="contained"
                    color="primary"
                    size="large"
                    type="submit"
                    fullWidth >
                        등록
                </Button>
                <Button className={classes.buttonSubmit} 
                    variant="contained"
                    color="inherit"
                    size="small"
                    onClick={userCards}
                    fullWidth >
                        {isUser ? '내 카드 보기' : '모든 카드 보기'}
                </Button>
                <Button  
                    variant="contained"
                    color="secondary"
                    size="small"
                    onClick={clear}
                    fullWidth >
                        초기화
                </Button>
            </form>
        </Paper>
    );
}

export default Form;
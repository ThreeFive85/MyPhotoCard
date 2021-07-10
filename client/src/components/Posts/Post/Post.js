import React from 'react';
import { Card, CardActions, CardContent, CardMedia, Button, Typography } from '@material-ui/core/';
import DeleteIcon from '@material-ui/icons/Delete';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import LockIcon from '@material-ui/icons/Lock';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import moment from 'moment';
import useStyles from './styles';
import { useDispatch } from 'react-redux';
import { deleteCard, lockCard } from '../../../actions/posts';

const Post = ({ post, setCurrentId }) => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('profile'));
    const tagsArr = post.tags.split(',');
    // console.log(user);
    // console.log('post', post)

    const Lock = () => {
        if(post.locked === 'unlock') return <><LockOpenIcon /></>
    
        return <><LockIcon /></>
        
    }

    return (
        <Card className={classes.card}>
            <CardMedia className={classes.media} image={post.selectedFile} title={post.title} />
            <div className={classes.overlay}>
                <Typography variant="h6">작성자 : {post.name}</Typography>
                <Typography variant="body2">{moment(post.createdAt).fromNow()}</Typography>
            </div>
            {(user?.result?.id === post?.user_id) && (
                <div className={classes.overlay2}>
                    <Button style={{color: 'white'}} size="small" onClick={() => setCurrentId(post.id)}>
                        <MoreHorizIcon fontSize="default" />
                    </Button>
                </div>
            )}
            <div className={classes.details}>
                <Typography variant="body2" color="textSecondary">{tagsArr.map((tag) => `#${tag} `)}</Typography>
            </div>
            <Typography className={classes.title} variant="h5" gutterBottom>{post.title}</Typography>
            <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">{post.message}</Typography>
            </CardContent>
            <CardActions className={classes.cardActions}>
                {(user?.result?.id === post?.user_id) && (
                    <Button size="small" color="primary" disabled={!user?.result} onClick={() => dispatch(lockCard(post.id))}>
                        <Lock />
                    </Button>
                )}
                {(user?.result?.id === post?.user_id) && (
                    <Button size="small" color="primary" onClick={() => dispatch(deleteCard(post.id))}>
                        <DeleteIcon fontSize="small" />
                        Delete
                    </Button>
                )} 
            </CardActions>
        </Card>
    );
}

export default Post;
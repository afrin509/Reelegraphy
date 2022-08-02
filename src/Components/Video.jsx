import { Avatar, makeStyles, Typography } from '@material-ui/core';
import React, { useState } from 'react'
// import Ticker from 'react-ticker';
import ChatBubbleIcon from '@material-ui/icons/ChatBubble';
import FavouriteIcon from '@material-ui/icons/Favorite';

function Video(props) {
    const [isMuted,setMuted]=useState(true);
    let useStyles = makeStyles((theme)=>({
        smallAv: {
            width: theme.spacing(3),
            height: theme.spacing(3),
            marginRight:"8px"
          },
        video:{
            height:"86vh",
          },
        profile:{
            // position:"absolute",
            color:"white",
            display:"flex",
            fontWeight:"bold",
        },
        chatComment:{ 
            // position:"absolute",
        display:"flex",marginTop:"1rem",left:"1rem"},
        ticker:{
            // position:"absolute",
            left:"1rem",
            right:"1rem",
            marginTop:"1rem"
        }
    }))
    let classes = useStyles();

    const handleMuted=(e)=>{
        e.preventDefault();
        setMuted(!isMuted);
    }

    return (
        <>
        <div style={{height:"100%",width:"40%",position:"relative"}}>
            <video className= {classes.video} onClick={(e) => { handleMuted(e) }} muted={isMuted} id={props.id} >
                <source src={
                    props.src
                } type="video/mp4"

                >
                </source>
            </video >
            <div style={{position:"absolute",bottom:"1rem",
            left:"1rem",}}>
            <div className={classes.profile}>
                <div><Avatar className={classes.smallAv} src={props.avatar} alt="profile" ></Avatar></div>
                <Typography>{ props.userName}</Typography>
                </div>
            <div className={classes.ticker}>
            {/* <Ticker direction="toRight" mode="smooth">
                {() => (
                   <Typography style={{color:"white"}}>This is the song 🎵</Typography> 
                )}
            </Ticker> */}
            </div>
            <div className={classes.chatComment}>
                <div>
                <FavouriteIcon style={{
                    fontSize:"2rem",
                    color:props.videoObj.isLiked==false?"white":"red",
                }} 
                onClick={() => { props.handleLiked(props.videoObj) }}
            ></FavouriteIcon>
            {props.videoObj.nol>0?<Typography style={{color:"white"}}>{props.videoObj.nol}</Typography>:null}
            </div>
            <ChatBubbleIcon style={{
                    fontSize:"2rem",
                    paddingLeft:"1rem",
                    color:"white",
                }} 
                onClick={() => { props.handleCommentModal(props.videoObj) }}
            ></ChatBubbleIcon>
            </div>
            </div>
            </div>
        </>
    )
}

export default Video

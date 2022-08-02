import React, { useEffect, useState, useContext } from 'react'
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthProvider';
import LinearProgress from '@material-ui/core/LinearProgress';
import AppBar from '@material-ui/core/AppBar';
import HomeIcon from '@material-ui/icons/Home';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import {Avatar,Container,Grid,Card, CardMedia,CardContent,Divider,TextField} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import {makeStyles} from '@material-ui/core';
import ExploreIcon from '@material-ui/icons/Explore';
import { storage, firestore, database } from "../firebase";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';   
import SendIcon from '@material-ui/icons/Send';
import Video from './Video';

const { v4: uuidv4 } = require('uuid');
// uuidv4();
function Feed() {
    // useEffect(() => {
    //     console.log("Feed is rendered")
    // })
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState();
    const [pageLoading,setPageLoading]=useState(true);
    const { signout,currentUser } = useContext(AuthContext);
    const [videos, setVideos] = useState([]);
    // const [isLiked, setLiked] = useState(false);
    const [isCommentModalVisible, setCommentModalVisibility]=useState(false);
    const [commentReel,setCommentReel]=useState({})
    const [comment,setComment]=useState("")
    const [comments,setComments]=useState([])
    const [reelComments,setReelComments]=useState([])

    let useStyles = makeStyles((theme)=>({
        small: {
            width: theme.spacing(4),
            height: theme.spacing(4),
            backgroundSize:"contain"
          },
          commentContainer:{
              display:"flex",
              marginTop:"8px",
              marginLeft:"8px"
          },
        centerDivs: {
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            width: "100vw"
            ,
            alignItems: "center",
            // paddingLeft: "10vw",
            // paddingRight: "10vw",
        },
        crousel: {
            height: "10rem",
            backgroundColor: "lightgray"
        },
        fullWidth: {
            width: "100%"
        },
        fullHeight:{
            height:"100%"
        },
        centerElements: {
            display: "flex",
            flexDirection: "column",
        },
        mb: {
            marginBottom: "0.5rem"
        },
        alignCenter: {
            display:"flex",
            justifyContent: "center",
            width:"100%"
        },
        heart: {
            // backgroundColor: "red"
            position: "absolute",
            left: "37vw",
            bottom: "-5vh",
            fontSize: "2rem"
        },
        notSelected: {
            color: "lightgray"
        },
        selected: {
            color: "red"
        },
        // alignitems: {
        //     textAlign: "center"
        // },
        image: {
            height:"3rem",
            backgroundSize: "contain"
        },
        title:{
            flexGrow:1,
            paddingLeft:"1rem",
        },
        commentModal:{
            width: "80vw",
            height: "80vh",
            /* align-self: center; */
            position: "fixed",
            zIndex: "10",
            left: "11rem",
            top: "5rem",
            borderRadius: "8px",
        },
        smallAv: {
            width: theme.spacing(3),
            height: theme.spacing(3),
          },
    }))

    function handleInputFile(e){
        e.preventDefault();
        let file = e?.target?.files[0];
         
        // if (file.size / (1024 * 1024) < 20) {
        //     alert("The selected file is very big");
        //     return;
        // }
        if (file != null) {
            // console.log(e.target.files[0])
            //setFile(e.target.files[0]);
            try{
                setLoading(true);
                let puid=uuidv4();
                const uploadTaskListener = storage
                .ref(`/reels/${puid}`).put(file);
                // fn1 -> progress
                // fn2 -> error 
                // fn3-> success
                uploadTaskListener.on('state_changed', fn1, fn2, fn3);
                function fn1(snapshot) {
                    var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(progress);
                }
                function fn2(error) {
                    alert("There was an error in uploading the file");
                    setLoading(false);
                    return;
                }
                async function fn3() {
                    uploadTaskListener.snapshot.ref.getDownloadURL().then(async url => {
                        // 2.  
                        // post collection -> post document put 
                        let obj = {
                            comments: [],
                            likes: [],
                            url,
                            auid: currentUser.uid,
                            createdAt: database.getUserTimeStamp(),
                        }
                        //   put the post object into post collection 
                        let reelObj = await database.reels.add(obj);
                        // 3. user postsId -> new post id put 
                        await database.users.doc(currentUser.uid).update({
                            reels: [...user.reels, reelObj.id]
                        })
                        // console.log(reelObj);
                        setLoading(false);
                    })
                }
            }catch(err){
                console.log(err);
                setLoading(false);
            }
        }
    }

    const handlePostComment=async(rid)=>{
        let cid=uuidv4();
        setComment("")
        let obj={
            comment,
            rid,
            userName:user.username,
            profileUrl:user.profileUrl,
            createdAt:database.getUserTimeStamp(),
        }
        await database.comments.doc(cid).set(obj);
        let reelRef = await database.reels.doc(rid).get();
        let reel = reelRef.data();
        let rComments = reel.comments;
        database.reels.doc(rid).update({
            "comments": [...rComments, cid]
        })
    }

    const handleCommentModal=(obj)=>{
        setCommentReel(obj);
        setCommentModalVisibility(true);
    }

    const handleLogout = async () => {
        try {
            setLoading(true);
            // auth provider 
            await signout();
            setLoading(false);
        } catch (err) {
            console.log(err);
            setLoading(false)
        }
    }

    const handleLiked = async (obj) => {
        let reelRef = await database.reels.doc(obj.rid).get();
        let reel = reelRef.data();
        let likes = reel.likes;
        if (obj.isLiked == false) {
            // likes = likes.filter(lkuid => {
            //     return lkuid != currentUser.uid;
            // })
            database.reels.doc(obj.rid).update({
                "likes": [...likes, currentUser.uid]
            })
        } else {
            likes = likes.filter(lkuid => {
                return lkuid != currentUser.uid;
            })
            database.reels.doc(obj.rid).update({
                "likes": likes
            })
        }
        // setLiked(!isLiked)
    }

    useEffect(async() => {
        let dataObject = await database.users.doc(currentUser.uid).get();
        // console.log(dataPromise.data());
        setUser(dataObject.data());
        setPageLoading(false);
    }, [])

    useEffect(async () => {
        let unsub = await database.reels.orderBy("createdAt", "desc").onSnapshot(async snapshot => {
            
            let videos = snapshot.docs.map(doc => doc.data());
            let videosArr = [];
            for (let i = 0; i < videos.length; i++) {
                let videoUrl = videos[i].url;
                let auid = videos[i].auid;
                let nol=videos[i].likes.length;
                let noc=videos[i].comments.length;
                let id = snapshot.docs[i].id;
                let isLiked=false;
                for(let l=0;l<nol;l++){
                    if(currentUser.uid==videos[i].likes[l]){
                        isLiked=true;
                        break;
                    }
                }
                let userObject = await database.users.doc(auid).get();
                let userProfileUrl = userObject.data()?.profileUrl;
                let userName = userObject.data()?.username;
                videosArr.push({ videoUrl, userProfileUrl, userName,rid: id,nol,noc,isLiked });
            }
            setVideos(videosArr);
        })
        return unsub;
    }, [])

    useEffect(async () => {
        let unsub = await database.comments.orderBy("createdAt", "desc").onSnapshot(async snapshot => {
            // console.log("snapshot called")
            let comments = snapshot.docs.map(doc => doc.data());
            let commentsArr = [];
            // let rcomments=[...reelComments]
            for (let i = 0; i < comments?.length; i++) {
                let comment = comments[i].comment;
                let userName = comments[i].userName;
                let id = snapshot.docs[i].id;
                let rid=comments[i].rid;
                let profileUrl = comments[i].profileUrl;
                commentsArr.push({ comment, profileUrl, userName,cid: id, rid });
                // console.log("creel",commentReel.rid,"c",comments[i].rid)
                // if(commentReel.rid!="" && commentReel.rid==comments[i].rid){
                //     rcomments.push({ comment, profileUrl, userName,cid: id });
                // }
            }
            setComments(commentsArr);
            // setReelComments(rcomments);
            // console.log(commentsArr);
            // console.log(rcomments);
        })
        return unsub;
    }, [])

    useEffect(async ()=>{
        // let unsub = await database.reels.doc(commentReel.rid).onSnapshot(async snapshot => {
            
            // let rcomments = snapshot?.data()?.comments;
            // console.log("data",rcomments);
            let reelComments=[];
            for(let i=0;i<comments?.length;i++){
                // console.log(comments[i].rid,commentReel.rid)
                if(comments[i].rid==commentReel.rid){
                    reelComments.push(comments[i]);
                }
            }
            setReelComments(reelComments);
        //     // setVideos(videosArr);
        // })   
        // return unsub;
    },[commentReel,comments])

    const callBack=(enteries)=>{
        console.log(enteries)
        enteries.forEach((entry)=>{
            let child=entry.target.children[0].children[0];
            console.log(child)
            if(entry.isIntersecting){
                child.play();
                child.loop=true;
            }else{
                child.loop=false;
                child.pause();
            }
        })
    }

    useEffect(() => {
        let conditionObject={
            root:null,
            threshold:'0.9'
        }
        let observer=new IntersectionObserver(callBack,conditionObject);
        let elements=document.querySelectorAll(".video-container");
        elements.forEach((ele)=>{
            observer.observe(ele);
        })
    }, [videos])

    let classes = useStyles();
    return (
        pageLoading?<div><LinearProgress color="secondary" /></div>:
        <div>
            <div className="navBar" key="navBar">
            <AppBar position="static" style={{backgroundColor:'white'}}>
                <Toolbar>
                  <div className={classes.title}>
                  <img className={classes.image} src="data:image/jpeg;base64,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"/>
                  </div>
                 
                
               <IconButton ><HomeIcon>
                    </HomeIcon></IconButton>
                <IconButton><ExploreIcon>
                    </ExploreIcon></IconButton>
                {/* <Link to="/profile"><Avatar src={user.profileUrl} alt="profile" className={classes.small}></Avatar></Link> */}
                </Toolbar>
            </AppBar>
            </div>

            <div className="upload-reels" style={{display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"1rem"}}>
                <Button
                    variant="contained"
                    component="label"
                    disabled={loading}
                    // className={classes.fullWidth}
                    style={{backgroundColor:'white',marginTop:'10px'}}
                    startIcon={<CloudUploadIcon style={{color:'red'}} />}
                    >
                    <Typography style={{color:'red'}}>UPLOAD REEL</Typography>
                    <input
                        type="file" accept="video/*" onChange={(e) => { handleInputFile(e) }}
                        hidden
                    />
                </Button>
                </div>
            <div className={classes.alignCenter} key="uploadbtn">
                <div className="reels">
                {videos.map((videoObj, idx) => {
                        return <div className="video-container" style={{marginTop:"1rem"}} key={videoObj.rid}>
                            <Video
                                src={videoObj.videoUrl}
                                id={videoObj.rid}
                                userName={videoObj.userName}
                                avatar={user.profileUrl}
                                handleLiked={handleLiked}
                                videoObj={videoObj}
                                handleCommentModal={handleCommentModal}
                            >
                            </Video>
                        </div>
                    })}
                    </div>
                {isCommentModalVisible==true?<div className={classes.commentModal}  tabIndex="0" onKeyDown={(e) => { if(e.key=="Escape")setCommentModalVisibility(false) }}>
                        <div style={{display:"flex"}} className={classes.fullHeight}>
                            <Card key="reel">
                            <CardMedia >
                                <video muted={true}  autoPlay
                                    style= {{height:"80vh"}}>
                                    <source src={commentReel.videoUrl}></source>
                                </video>
                            </CardMedia>
                                {/* <CardMedia component='video' src={reelsrc} autoPlay ></CardMedia> */}
                            </Card>
                            <Card key="content" style={{width:"60%"}}>
                                <CardContent style={{height:"100%"}}>
                                    <div style={{display:"flex",height:"10%"}}>
                                        <div style={{margin:"8px"}}>
                                            <Avatar src={commentReel.userProfileUrl} alt="profile" ></Avatar>
                                        </div>
                                        <div style={{margin:"8px"}}>
                                            {commentReel.userName}
                                        </div>
                                    </div>
                                    <Divider />  
                                    <div style={{height:"80%",overflow:"auto"}}>
                                    {reelComments.map((commentObj, idx) => {
                                        // console.log(videoObj);
                                        return <div className={classes.commentContainer} key={commentObj.cid}>
                                            <Avatar className={classes.smallAv} src={commentObj.profileUrl} alt="profile" ></Avatar>
                                            <Typography style={{marginLeft:"8px",marginRight:"8px"}}>{commentObj.userName}</Typography> 
                                            <Typography>{commentObj.comment}</Typography> 
                                        </div>
                                    })}
                                    </div>
                                    <Divider />
                                    <div style={{display:"flex",height:"10%"}}>
                                    <TextField id="standard-basic" style={{width:"90%",height:"80%"}} onChange={(e)=>{setComment(e.target.value)}}
                                        value={comment}  placeholder="Enter your comment here" />
                                    <IconButton onClick={() => { handlePostComment(commentReel.rid) }} style={{marginLeft:"2%",marginBottom:"1%"}}>
                                        <SendIcon ></SendIcon>
                                    </IconButton>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                </div>:null}
            </div>
        </div>
    )
}

export default Feed
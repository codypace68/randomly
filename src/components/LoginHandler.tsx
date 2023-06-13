import { GoogleLogin } from '@react-oauth/google';
import Header from './header';
import Body from './body';
import { redirect } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import {useEffect, useInsertionEffect} from "react";
import GuestUser from './guestUser';
import axios from 'axios';
import { setSourceMapRange } from 'typescript';


function parseJwt (token: any) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function LoginHandler(props: {user: {name: string, picture: string, id: number, firstname: string, lastname: string} | undefined, setUser: Function, redirect?: Function, guest?: Boolean}) {
    let userData: any = {};
    const navigate = useNavigate();
    console.log(props)

    useEffect(() => {
        document.title = "Randomly"
        console.log('user is undefined', props.user === undefined);
        if (props.user !== undefined) return;
        userData = {
            id: null,
            email: 'guest@domain.com',
            given_name: 'Guest',
            family_name: 'User',
            name: 'Guest User',
            picture: '/profile_stub.png'
        }

        // set the users email address if available
        if (window.sessionStorage.useremail) { 
            userData.email = window.sessionStorage.useremail; 
            console.log('user email set to', userData.email)
        }

        axios.get(process.env.REACT_APP_API + '/users/' + userData.email.trim())
        .then(res => {
            if (res.data.user.length === 0) {
                // add new user
                axios.post(process.env.REACT_APP_API + '/users', userData)
                    .then(addRes => {
                        userData.id = addRes.data.id;
                        window.sessionStorage.useremail = userData.email;
                        props.setUser(userData);
                        console.log('redirecting to root')
                        navigate('/')
                    });
            } else {
                userData = res.data.user[0];
                console.log('user found in db', userData)
                props.setUser(userData);
                console.log('redirecting to root')

                navigate('/')
            }
        });
    })
    
    
    if (props.guest) {
        return <div></div>
    }
    
    if (!props.user && !props.guest) {
        return <>
            <div style={{padding: '50px'}}>
                <GoogleLogin 
                    onSuccess={async (res) => {
                        console.log('user logged in successfully')
                        const userData = parseJwt(res.credential);
                        console.log(userData);
                        let userId;
                        

                        // Create new user if needed
                        const response = await axios.get(process.env.REACT_APP_API + '/users/' + userData.email.trim());
                        console.log('user pulled from db', response.data.user);
                        
                        if (response.data.user.length === 0) {
                            // add new user
                            const addUserRes = await axios.post(process.env.REACT_APP_API + '/users', userData);
                            userId = addUserRes.data.id;
                        } else userId = response.data.user[0].id;

                        console.log('setting user id up and session state')
                        userData['id'] = userId;
                        window.sessionStorage.useremail = userData.email;
                        console.log('setting user')
                        props.setUser(userData);
                        navigate('/')
                    }}
                />
            </div>

        </>
    }

    if (props.user !== undefined) {
        console.log('returning login handler');
        return <>
            {props.user.firstname + " " + props.user.lastname === 'Guest User' ? 
                <GoogleLogin 
                    onSuccess={async (res) => {
                        const userData = parseJwt(res.credential);
                        console.log(userData);
                        let userId;
                        

                        // Create new user if needed
                        const response = await axios.get(process.env.REACT_APP_API + '/users/' + userData.email.trim());
                        console.log(response.data.user);
                        
                        if (response.data.user.length === 0) {
                            // add new user
    
                            const addUserRes = await axios.post(process.env.REACT_APP_API + '/users', userData);
                            userId = addUserRes.data.id;
                        } else userId = response.data.user[0].id;

                        userData['id'] = userId;
                        userData['firstname'] = userData.given_name;
                        userData['lastname'] = userData.family_name;
                        props.setUser(userData);
                        window.sessionStorage.useremail = userData.email;

                        navigate('/');
                    }}
                    useOneTap
                /> 
            : ""}
            <Header UserName={props.user.firstname + " " + props.user.lastname} UserProfilePicURL={props.user.picture} logout={() => props.setUser(undefined)}></Header>
            <Body userid={props.user.id} userChanged={props.user.name !== 'Guest User'}></Body>
        </>
    }
    else {
        console.log('returning empty div')
        return <div></div>
    }
}

export {LoginHandler}
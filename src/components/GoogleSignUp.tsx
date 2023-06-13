// export component to display option to sign up with google

// Path: src\components\LoginHandler.tsx
// Compare this snippet from src\components\guestUser.tsx:
import React from 'react';
import { GoogleLogin } from '@react-oauth/google';

// display white background with option to sign up with google
export function GoogleSignUp(props: {redirect: Function}) {
    return (
        <div className='d-flex pt-5 align-items-center ' style={{width: '100vw', height: '100vh', backgroundColor: '#f6f6f6', flexDirection: 'column'}}>
            <img className='mb-5' src='/favicon.ico' alt='logo' style={{height: '75px', width: '75px'}}/>

            <div className='d-flex justify-content-center align-items-center flex-column' style={{width: '50%', background:'#fff', paddingTop: '10px', paddingBottom:'10px', border: '1px solid rgb(220, 220, 220)', borderRadius:'5px', boxShadow:'rgb(220, 220, 220) 2px 2px 6px'}}>
                
                <h5 className='text-center' style={{fontFamily:"NotoSerifToto", marginTop: '8px'}}>Sign up with Google</h5>
                <div className='divider'></div>
                <GoogleLogin
                    onSuccess={(response: any) => {
                        console.log(response);
                        props.redirect('/');
                    }}  
                />
            </div>
            
        </div>
    );
    }



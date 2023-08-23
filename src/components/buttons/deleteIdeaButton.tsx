import React from 'react';
import CSS from 'csstype';
import axios, { AxiosResponse } from 'axios';
import { preProcessFile } from 'typescript';
import { PropsFromToggle } from 'react-bootstrap/esm/DropdownToggle';
import Icon from '@mdi/react';
import { mdiDeleteEmpty as DeleteIdeaIcon}  from '@mdi/js';
import {type Idea} from '../../types';


type DeleteIdeaProp = {
    checkedIdea: Idea,
    updateIdeas: Function,
}




function DeleteIdeaButton(props: DeleteIdeaProp) {// prop updated whenever word or category changes
    let [idea, setIdea] = React.useState<String>('');

    async function deleteIdea() {        
        console.log('deleting idea')
        axios.delete(process.env.REACT_APP_API +  `/ideas?id=${props.checkedIdea.id}`)
            .then(result => {
                console.log(result)
                props.updateIdeas(true);
            })
            .catch(e => {
                alert('Sorry about that. Something went wrong while deleting that idea. Please contact support if this issue continues.');
            })
    }

    function handleIdeaChange(value: String) {
        setIdea(value)
    }


    return ( 
        <>
            <div className='d-inline p-1' onClick={() => deleteIdea()} style={{fontSize:'1rem'}}>
                Delete Idea
            </div>
        </>

    )
}

export default DeleteIdeaButton;

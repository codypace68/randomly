import React from 'react';
import CSS from 'csstype';
import axios, { AxiosResponse } from 'axios';
import { preProcessFile } from 'typescript';
import { PropsFromToggle } from 'react-bootstrap/esm/DropdownToggle';
import Icon from '@mdi/react';
import { mdiDeleteEmpty as DeleteIdeaIcon}  from '@mdi/js';


type DeleteIdeaProp = {
    checkedIdeas: number[],
    updateIdeas: Function
}




function DeleteIdeaButton(props: DeleteIdeaProp) {// prop updated whenever word or category changes
    let [idea, setIdea] = React.useState<String>('');

    async function deleteIdea() {
        const deletedIdeasQueue: Array<Promise<AxiosResponse>> = [];
        console.log(`length of ideas to delete: ${props.checkedIdeas.length}`);

        if (props.checkedIdeas.length > 1) {
            if (!window.confirm(`You are about to delete ${props.checkedIdeas.length} ideas. Are you sure you want to continue?`)) return;
        }
        
        props.checkedIdeas.forEach(idea => {
            deletedIdeasQueue.push(axios.delete(process.env.REACT_APP_API +  `/ideas?id=${idea}`));
        });
        
        Promise.all(deletedIdeasQueue)
            .then(result => {
                props.updateIdeas(true);
            })
            .catch(e => {
                console.log('Error occurred while deleting ideas', e);
                alert('Sorry about that. Something went wrong while deleting those ideas. Please contact support if this issue continues.');
            })
    }

    function handleIdeaChange(value: String) {
        setIdea(value)
    }


    return ( 
        <>
            <div className='d-inline' onClick={() => deleteIdea()} >
                <Icon path={DeleteIdeaIcon} className='rand-ideas-header-icon ms-1'/>
            </div>
        </>

    )
}

export default DeleteIdeaButton;

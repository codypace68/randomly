import React from 'react';
import CSS from 'csstype';
import Modal from 'react-bootstrap/Modal';
import ModalHeader from 'react-bootstrap/ModalHeader';
import ModalTitle from 'react-bootstrap/ModalTitle';
import ModalBody from 'react-bootstrap/ModalBody';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Icon from '@mdi/react';
import { mdiPencilBoxMultiple as EditIdeaIcon}  from '@mdi/js';
import axios from 'axios';
import {type Idea} from '../../types';



type EditIdeaModalProp = {
    word: {
        id: number,
        name: string
    },
    category: number | null,
    updateIdeas: Function,
    checkedIdea: Idea,
    linkedWord: string | undefined
}




function EditIdeaModal(props: EditIdeaModalProp) {// prop updated whenever word or category changes
    let [show, setShow] = React.useState<boolean | undefined>();
    let [idea, setIdea] = React.useState<Idea>();

    React.useEffect(() => {
        setIdea(props.checkedIdea);
    }, [props.checkedIdea])

    const closeModal = () => {
        setShow(false);
    };

    async function submitIdea() {
        const data = {
            idea,
            category: props.category,
            word: props.word.id
        }
        
        console.log('request data', data);
        const response = await axios.patch(process.env.REACT_APP_API + '/ideas', data);

        setShow(false);
        props.updateIdeas();
        return response.data.id    
    }

    function handleIdeaChange(value: string) {
        // create copy of current idea object for updating
        const newIdea: Idea = JSON.parse(JSON.stringify(idea));
        newIdea.idea = value;

        setIdea(newIdea);
    }


    if (idea) {
        return ( 
        <>
            <div className='d-inline p-1' onClick={() => setShow(true)} style={{fontSize:'22px'}}>
                Edit Idea
            </div>

            <Modal id='rand-ideas-modal-add-idea' show={show} onHide={closeModal}>
                <ModalHeader>
                    <ModalTitle>Edit Idea for word <b>{props.linkedWord}</b></ModalTitle>
                </ModalHeader>
                <ModalBody>
                    <FormControl as="textarea" rows={5} id="idea-text" className='mb-2' type='text' name='idea' value={idea.idea} onChange={(e => handleIdeaChange(e.currentTarget.value))}></FormControl>
                    <Button onClick={(e) => submitIdea()}>Save Idea</Button>
                </ModalBody>
            </Modal>
        </>

    ) 
        } else return (<></>)
}

export default EditIdeaModal;

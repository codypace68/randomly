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


type EditIdeaModalProp = {
    word: {
        id: number,
        name: string
    },
    category: number | null,
    updateIdeas: Function,
    checkedIdeaID: number,
    checkedIdea: string
}




function EditIdeaModal(props: EditIdeaModalProp) {// prop updated whenever word or category changes
    let [show, setShow] = React.useState<boolean | undefined>(false);
    let [idea, setIdea] = React.useState<String>('');

    const closeModal = () => {
        setShow(false);
    };

    async function submitIdea() {
        const data = {
            idea,
            category: props.category,
            word: props.word.id
        }
    
        console.log(data);
    
        const response = await axios.post(process.env.REACT_APP_API + '/ideas', data);

        setShow(false);
        props.updateIdeas();
        return response.data.id    
    }

    function handleIdeaChange(value: String) {
        setIdea(value)
    }


    return ( 
        <>
            <div className='d-inline' onClick={() => setShow(true)}>
                <Icon  path={EditIdeaIcon} className='rand-ideas-header-icon ms-1'  />
            </div>

            <Modal id='rand-ideas-modal-add-idea' show={show} onHide={closeModal}>
                <ModalHeader>
                    <ModalTitle>Edit Idea for word <b>{props.word.name}</b></ModalTitle>
                </ModalHeader>
                <ModalBody>
                    <FormControl className='mb-2' type='text' name='idea' value={props.checkedIdeas[0]} onChange={(e => handleIdeaChange(e.currentTarget.value))}></FormControl>
                    <Button onClick={(e) => submitIdea()}>Save Idea</Button>
                </ModalBody>
            </Modal>
        </>

    )
}

export default EditIdeaModal;

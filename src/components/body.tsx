import React from 'react';
import '../styles/Header.css';
import '../styles/Body.css';
import '../styles/Fonts.css'
import CSS from 'csstype';
import Card from 'react-bootstrap/Card';
import CardHeader from 'react-bootstrap/CardHeader'
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'
import FormSelect from 'react-bootstrap/FormSelect';
import axios from 'axios';
import { Dropdown } from 'react-bootstrap';
import {type Idea} from '../types';
import {type Category} from '../types';
import {type Word} from '../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb, faPlusCircle } from '@fortawesome/free-solid-svg-icons';

// Idea Functions (edit add delete)
import EditIdeaModal from './modals/editIdeaModal';
import AddIdeaModal from './modals/addIdeaModal';
import DeleteIdeaButton from '../components/buttons/deleteIdeaButton';


const buttonContainerStyles: CSS.Properties = {
    width: "170px",
}

const fetchIdeas = async (userid?: number, id?: number): Promise<Idea[]> => {
    const response = await axios.get(process.env.REACT_APP_API + '/ideas/' + userid);
    return response.data.ideas;
}

const fetchWords = async (id?: number): Promise<Word[]> => {
    const response = await axios.get(process.env.REACT_APP_API + '/words');
    return response.data.words;
}

const fetchCategories = async (id?: number): Promise<Category[]> => {
    const response = await axios.get(process.env.REACT_APP_API + '/categories');
    return response.data.categories;
}

const fetchRandomWord = async (categoryID: number) => {
    const response = await axios.get(process.env.REACT_APP_API + `/randomword/${categoryID}`);
    return response.data.word;
}

function Body(props: {userid: number, userChanged: boolean}) {
    // Primary data types
    let [ideas, setIdeas] = React.useState<Idea[] | []>([]);
    let [userId, setUserId] = React.useState<number>(0);
    let [userChanged, setUserChanged] = React.useState<boolean>(props.userChanged);
    let [categories, setCategories] = React.useState<Category[] | []>([]);
    let [words, setWords] = React.useState<Word[] | []>([]);
    let [selectedWord, setSelectedWord] = React.useState<{name: string, id: number}>({name: '', id: 0});
    let [selectedIdea, setSelectedIdea] = React.useState<Idea>({
        id: 0,
        rating: 0,
        category: '',// Note here this is a number in the DB but exposed as the category name in the API
        word: '',
        idea: '',
        Word: {
            id: 0,
            category: '',
            word: '',
            definition: null,
            active: false,
            createdBy: new Date(),
            updatedAt: new Date()    
        }
    });
    let [linkedWord, setLinkedWord] = React.useState<string | undefined>('');

    React.useEffect(() => {
        console.log(props.userid, userId);
        if (props.userid === userId) return;
        console.log('fetching ideas')
        fetchIdeas(props.userid).then((ideas) => setIdeas(ideas));
        fetchCategories().then((categories) => {
            setCategories(categories)

            fetchRandomWord(categories[0].id).then((word) => {
                console.log('word returned', word)
                setSelectedWord({name: word.word, id: word.id});
                setWords([word])
            });
        });
        setUserId(props.userid);
    })

    async function populateNewWord(e: React.MouseEvent, retries = 1) {
        console.log(retries);
        if (retries === undefined) retries = 0;
        if (retries >= 6) return alert('Looks like we hit a snag finding a new word. Maybe you used them all?')

        fetchRandomWord(categories[0].id).then((word) => {
            const duplicates = [...words].filter(w => w.id === word.id);
            console.log('retries in then', retries)
            if (duplicates.length > 0) {
                retries++;
                return populateNewWord(e, retries);
            }

            setWords([word, ...words]);
            setSelectedWord({name: word.word, id: word.id});
        })
    }

    function updateIdeas(resetChecked?: boolean) {
        fetchIdeas(props.userid).then((ideas) => setIdeas(ideas));
    }

    // update select word when selection changes
    function handleWordSelectionChange(e: React.FormEvent<HTMLSelectElement>) {
        setSelectedWord({id: parseInt(e.currentTarget.options[e.currentTarget.selectedIndex].id), name: e.currentTarget.options[e.currentTarget.selectedIndex].innerText})
    }

    const handleIdeaSelection = async (e: React.MouseEvent<SVGTextElement>) => {
        const checkBox = e.currentTarget;
        const currentIdeas: Idea[] = [...ideas];
        const currentIdea = currentIdeas.filter((a) => a.id === parseInt(checkBox.id))[0]; 
    

        console.log('setting current idea to', currentIdea);
        setLinkedWord(e.currentTarget.dataset.linkedword)
        setSelectedIdea(currentIdea);
    }

    // The forwardRef is important!!
    // Dropdown needs access to the DOM node in order to position the Menu
    const CustomToggle = React.forwardRef(({children, onClick}: any, ref) => {
        return (
        
        <div>
            <a
                href=""
                onClick={(e) => {
                    e.preventDefault();
                    onClick(e);
                }}
                style={{
                    color: 'grey',
                    textDecoration: 'none'
                }}
            >
            {children}
            </a>
        </div>
    )});

    return (
    <div className='rand-content'>
        <Card className='m-3'>
            <CardHeader className='bg-rand-primary-light text-light'>Create Inspiration</CardHeader>
                <Container className='m-0' fluid>
                    <Row className='border-bottom'>
                        <Col md="12">
                            <div className='flex-column flex m-0'>
                                
                                <Button onClick={(e) => populateNewWord(e)} className='m-2 bg-rand-primary-dark border-rand-primary-dark'>Inspire Me! <FontAwesomeIcon className="ms-2" icon={faLightbulb}/></Button>
                                <AddIdeaModal word={selectedWord} category={1}  updateIdeas={updateIdeas} userid={props.userid}/>
                                {/* <Button className='m-2 bg-rand-secondary-light border-rand-secondary-light'>Add New Word</Button> */}
                            </div>
                        </Col>                        
                    </Row>
                    <Row className='border-bottom ps-2 pe-2'>
                        {/* Add a header above form select to describe what it is showing */}
                        <Col md='12'>
                            <h4 className='text-center mt-3'>Random Inspiration</h4>
                        </Col>
                        <Col className=' h-100 ml-2 justify-content-md-center' md="12">
                                {/* TODO: change the dropdown icon to history icon to better reflect purpose */}
                                <FormSelect id="word-display" onChange={(e) => handleWordSelectionChange(e)} value={selectedWord.name} className='mb-2 mt-2 d-inline-block border-0 text-center'>
                                    {
                                        words?.map( ({id, word}, index) => (
                                            <option value={word} key={id} id={id.toString()}>{word}</option>
                                        )
                                        )
                                    }
                                </FormSelect>
                        </Col>
                    </Row>
                </Container>
        </Card>
        <Card className='m-3'>
            <CardHeader className='bg-rand-primary-light text-light'>Capture Your Ideas 

            </CardHeader>
                <Container className='m-0' fluid>
                    {ideas.map(({id, idea, word, Word}) => (
                        <div className='h-100 border-bottom mt-1'>
                            <Row key={id} >
                                {/* <div className='d-inline pe-0' style={{width: '30px', fontSize: '1.5rem', color:'#9f9f9f', lineHeight:'10px'}}>...</div> */}
                                <Dropdown className='d-inline pe-0' style={{width: '30px', fontSize: '1.5rem', color:'#9f9f9f', lineHeight:'10px',}}>
                                    <Dropdown.Toggle as={CustomToggle} /*onClick={(e) => handleIdeaSelection(e)}*/ variant="success">
                                        <text id={id.toString()} data-linkedword={Word.word} onClick={(e) => handleIdeaSelection(e)}>...</text>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        <Dropdown.Item href="#" className='mb-3'><EditIdeaModal word={selectedWord} linkedWord={linkedWord} category={1} updateIdeas={updateIdeas} checkedIdea={selectedIdea}/></Dropdown.Item>
                                        <Dropdown.Item href="#" ><DeleteIdeaButton updateIdeas={updateIdeas} checkedIdea={selectedIdea}/></Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                                {/* <FormCheck id={id.toString()} onChange={handleIdeaSelection} className='d-inline-block idea-selection pe-3 mt-0 rand-word-select' style={{width: '10px'}}></FormCheck> */}
                                <p className='d-inline-block mb-1' style={{fontSize: "18px", width: "90%", fontFamily: "NotoSerifToto"}}>{idea}</p>
                            </Row>
                            <Row className='d-flex align-items-end'>
                                <div className='text-secondary w-auto mb-2' style={{fontSize:'14px'}}>
                                    #{Word.word}                 
                                </div>
                            </Row>
                        </div>
                    ))
                    }
                </Container>
        </Card> 
    </div>
  );
}

export default Body;

import React from 'react';
import '../styles/Header.css';
import '../styles/Body.css';
import CSS from 'csstype';
import Card from 'react-bootstrap/Card';
import CardHeader from 'react-bootstrap/CardHeader'
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'
import FormCheck from 'react-bootstrap/FormCheck';
import FormSelect from 'react-bootstrap/FormSelect';
import axios from 'axios';
import Badge from 'react-bootstrap/Badge';

// Idea Functions (edit add delete)
import EditIdeaModal from './modals/editIdeaModal';
import AddIdeaModal from './modals/addIdeaModal';
import DeleteIdeaButton from '../components/buttons/deleteIdeaButton';


const buttonContainerStyles: CSS.Properties = {
    width: "170px",
}

type Idea = {
    id: number,
    rating: number,
    category: string,// Note here this is a number in the DB but exposed as the category name in the API
    word: string,
    idea: string,
    Word: Word
}

type Category = {
    id: number,
    category: string,
    active: boolean,
    createdBy: Date,
    updatedAt: Date
}

type Word = {
    id: number,
    category: string,
    word: string,
    definition: string | null,
    active: boolean,
    createdBy: Date,
    updatedAt: Date    
}

const fetchIdeas = async (id?: number): Promise<Idea[]> => {
    const response = await axios.get(process.env.REACT_APP_API + '/ideas');
    console.log('ideas', response.data)
    return response.data.ideas;
}

const fetchWords = async (id?: number): Promise<Word[]> => {
    const response = await axios.get(process.env.REACT_APP_API + '/words');
    console.log(response);
    return response.data.words;
}

const fetchCategories= async (id?: number): Promise<Category[]> => {
    const response = await axios.get(process.env.REACT_APP_API + '/categories');
    console.log(response);
    return response.data.categories;
}

function Body() {
    // Primary data types
    let [ideas, setIdeas] = React.useState<Idea[] | []>([]);
    let [checkedIdeas, setCheckedIdeas] = React.useState<number[]>([]);
    let [categories, setCategories] = React.useState<Category[] | []>([]);
    let [words, setWords] = React.useState<Word[] | []>([]);
    let [selectedWord, setSelctedWord] = React.useState<{name: string, id: number}>({name: '', id: 0});

    React.useEffect(() => {
        console.log('running axios get 2');

        if (ideas.length > 0) return;
        fetchIdeas().then((ideas) => setIdeas(ideas));
        fetchWords().then((words) => {
            console.log('setting default word to', words[0].word)
            setSelctedWord({name: words[0].word, id: words[0].id});
            setWords(words)
        });
        fetchCategories().then((categories) => setCategories(categories));
    }, [])

    React.useEffect(() => {
        console.log('Current checked ideas: ', checkedIdeas);
    })

    function updateIdeas(resetChecked?: boolean) {
        fetchIdeas().then((ideas) => setIdeas(ideas));

        if (resetChecked) setCheckedIdeas([]);
    }

    // update select word when selection changes
    function handleWordSelectionChange(e: React.FormEvent<HTMLSelectElement>) {
        setSelctedWord({id: parseInt(e.currentTarget.options[e.currentTarget.selectedIndex].id), name: e.currentTarget.options[e.currentTarget.selectedIndex].innerText})
    }

    const handleIdeaSelection = async (e: React.FormEvent<HTMLInputElement>) => {
        const checkBox = e.currentTarget;
        const currentIdeaId = parseInt(e.currentTarget.id); 

        if (e.currentTarget.checked && checkedIdeas.indexOf(parseInt(e.currentTarget.id)) <= 0) {
            setCheckedIdeas([...checkedIdeas, currentIdeaId]);
            return 
        } 

        setCheckedIdeas(checkedIdeas.filter((a, b) => a !== currentIdeaId));
    }

    return (
    <div>
        <Card className='m-3'>
            <CardHeader className='bg-rand-primary-light text-light'>Random Word</CardHeader>
                <Container className='m-0'>
                    <Row className='h-100'>
                        <Col md="2">
                            <div className='flex-column flex m-0'>
                                <Button className='m-2 bg-rand-primary-dark border-rand-primary-dark'>Generate Word</Button>
                                <Button className='m-2 bg-rand-secondary-light border-rand-secondary-light'>Add New Word</Button>
                            </div>
                        </Col>
                        <Col md="3"></Col>
                        <Col className=' h-100 ml-2 border-bottom justify-content-md-center' md="4">
                                {/* TODO: change the dropdown icon to history icon to better reflect purpose */}
                                <FormSelect id="" onChange={(e) => handleWordSelectionChange(e)} className='mb-2 mt-2 d-inline-block border-0 text-center'>
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
            <CardHeader className='bg-rand-primary-light text-light'>Ideas 
                <EditIdeaModal word={selectedWord} category={1} updateIdeas={updateIdeas} checkedIdeas={checkedIdeas}/>
                <AddIdeaModal word={selectedWord} category={1}  updateIdeas={updateIdeas}/>
                <DeleteIdeaButton updateIdeas={updateIdeas} checkedIdeas={checkedIdeas}/>
            </CardHeader>
                <Container className='m-0' fluid>
                    {ideas.map(({idea, word, id, Word}) => (
                        <div className='h-100 border-bottom mt-1'>
                            <Row key={id} >
                                <FormCheck id={id.toString()} onChange={handleIdeaSelection} className='d-inline-block' style={{width: '10px'}}></FormCheck>
                                <p className='d-inline-block w-75 mb-1'>{idea}</p>
                            </Row>
                            <Row className='d-flex align-items-end'><div className='badge badge-pill bg-rand-secondary-dark w-auto ms-2 mb-2' style={{fontSize:'10px'}}>{Word.word}</div></Row>
                        </div>
                    ))
                    }
                </Container>
        </Card> 
    </div>
  );
}

export default Body;

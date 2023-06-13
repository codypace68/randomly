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

export {
    type Idea,
    type Category,
    type Word
}
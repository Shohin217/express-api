const express = require('express');
const cors = require('cors');

const server = express();
server.use(cors());
server.use(express.json());


let nextPostId = 1;
let posts = [
    {id:nextPostId++, name:'post1'},
    {id:nextPostId++, name:'post2'},
]

const ERR_BAD_REQUEST = 'error.bad_request';
const ERR_NOT_FOUND = 'error.not_found';

server.get('/api/posts', (req, res) => {
    res.send(posts);
});
 
server.post('/api/posts', (req, res) => {
    const post = req.body;
    if (post.id === 0) {
        posts = [...posts, { ...post, id: nextPostId++ }]
        res.statusCode = 201
        res.send()
        return;
    }
    if(isNaN(post.id)){
        res.statusCode = 400;
        res.send({error: ERR_BAD_REQUEST});
        return;
    }
    if(posts.some(i => i.id === post.id)){
        posts = posts.map(o => o.id === post.id ? { ...o, ...post } : o)
        res.send();
        return;
    }else{
        res.statusCode = 404;
        res.send({error: ERR_NOT_FOUND})
    }
    res.send();
});

server.delete('/api/posts/:id', (req, res) => {
    const { id } = req.params;
    const parsedId = parseInt(id, 10);
    if(isNaN(id)){
        res.statusCode = 400;
        res.send({error: ERR_BAD_REQUEST});
        return;
    }
    if(posts.some(i => i.id == id)){
        posts = posts.filter(o =>  o.id !== parsedId)
        res.send()
        return
    }else{
        res.statusCode = 404; 
        res.send({error: ERR_NOT_FOUND})
    }
    res.send();
});

const port = process.env.PORT || 9999;

server.listen(port);



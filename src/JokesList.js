import React, { Component } from 'react'
import './JokesList.css';
import axios from 'axios';
import Joke from './Joke';
import uuid from 'uuid/dist/v4';
const jokes_Url = "https://icanhazdadjoke.com/";

class JokesList extends Component {
    static defaultProps = {
        numJokesToGet: 10
    };

    constructor(props) {
        super(props);
        this.state = {
            jokes: JSON.parse(window.localStorage.getItem("jokes") || "[]"),
            isLoading: false
        }
        this.seenJokes = new Set(this.state.jokes.map( j => j.joke));
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
        if(this.state.jokes.length === 0) {
            this.getJokes();
        }
    }

    async getJokes() {
        try {
        let jokes = [];
        while(jokes.length < this.props.numJokesToGet) {
         let res = await axios.get(jokes_Url , { headers: { Accept: "application/json"}});
         let newJoke = res.data.joke;
         if(!this.seenJokes.has(newJoke)){

         }
         jokes.push({ id: uuid() , joke:newJoke , votes: 0});
        }
        this.setState( oldState => ({
            isLoading: false,
            jokes: [...oldState.jokes, ...jokes]
        }),
        () => window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
        );
        window.localStorage.setItem("jokes",JSON.stringify(jokes));
        } catch(err) {
            alert(err);
            this.setState({isLoading: false});
        }
    }

    handleVote(id , change) {
        this.setState( oldState => ({
                jokes: oldState.jokes.map( j => 
                j.id === id ? {...j, votes: j.votes + change} : j
                )
        }), 
        () => window.localStorage.setItem("jokes", JSON.stringify(this.state.jokes))
        );
    }

    handleClick() {
        this.setState({isLoading: true}, this.getJokes);
    }

  render() {
      if(this.state.isLoading) {
          return (
              <div className="JokesList-spinner">
                  <i className=" far fa-8x fa-laugh fa-spin" />
                  <h1 className="JokeList-title">Loading Please Wait...</h1>
              </div>
          );
      }
      let jokes = this.state.jokes.sort((a,b) => b.votes - a.votes);
    return (
        <div className="JokesList">
            <div className="JokeList-sidebar">
                <h1 className="JokeList-title"><span>Awesome</span> Jokes </h1>
                <img src='https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg' alt="img" />
                <button className="JokeList-getmore" onClick={this.handleClick}>New Jokes</button>
            </div>
          
          <div className="JokeList-jokes">
                {jokes.map( j => (
                    < Joke 
                      key={j.id} 
                      Joke={j.joke} 
                      votes={j.votes} 
                      upvotes={ () => this.handleVote(j.id, 1)} 
                      downvotes={ () => this.handleVote(j.id, -1)} 
                    />

                ))}
          </div>

        </div>
    );
  }
}

export default JokesList;
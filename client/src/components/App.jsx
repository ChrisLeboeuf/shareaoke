import React from 'react';
import { HashRouter, Switch, Route } from 'react-router-dom';
import axios from 'axios';
import Main from './Main.jsx';
import SignUpLogin from './SignUpLogin.jsx';
import Friends from './Friends.jsx';
import Playlists from './Playlists.jsx';
import CreatePlaylist from './CreatePlaylist.jsx';
import Playlist from './Playlist.jsx';
import SearchForSongs from './SearchForSongs.jsx';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id_user: 0,
      token: '',
      username: '',
      playlists: [],
    };
  }

  componentDidMount() {
    axios.get('/spotify/user')
      .then(({ data }) => data.display_name)
      .then((username) => {
        this.setState({
          username,
        });
      })
      .then(() => {
        this.getUserInfo();
      })
      .catch((err) => console.error(err));

    axios.get('/spotify/token')
      .then(({ data }) => data.access_token)
      .then((token) => {
        this.setState({
          token,
        });
      })
      .catch((err) => console.error(err));
  }

  getUserInfo() {
    const { username } = this.state;
    console.log('Fetching user info');
    axios.get(`/api/user/${username}`)
      .then(({ data }) => {
        this.setState({
          id_user: data[0].id,
        });
      })
      .then(() => {
        const { id_user } = this.state;
        axios.get(`/api/playlist/${id_user}`)
          .then(playlists => this.setState({ playlists: playlists.data }))
          .catch(err => console.error(err));
      })
      .catch(() => {
        this.createUser();
      });
  }

  createUser() {
    console.log('creating user');
    const { username } = this.state;
    axios.post(`/api/user/${username}`)
      .then(({ data }) => {
        this.setState({
          id_user: data,
        });
      })
      .catch(err => {
        console.error(err);
      });
  }

  render() {
    const {
      username,
      id_user,
      token,
      playlists,
    } = this.state;

    return (
      <HashRouter>
        <Switch>
          <Route exact path="/" component={SignUpLogin} />
          <Route exact path="/main" render={(routerProps) => (<Main {...routerProps} username={username} id_user={id_user} token={token} />)} />
          <Route exact path="/playlists" render={(routerProps) => (<Playlists {...routerProps} username={username} id_user={id_user} token={token} playlists={playlists} />)} />
          <Route exact path="/friends" render={(routerProps) => (<Friends {...routerProps} username={username} id_user={id_user} token={token} />)} />
          <Route exact path="/createplaylist" render={(routerProps) => (<CreatePlaylist {...routerProps} username={username} id_user={id_user} token={token} />)} />
          <Route exact path="/playlist" render={(routerProps) => (<Playlist {...routerProps} username={username} id_user={id_user} token={token} />)} />
          <Route exact path="/search" render={(routerProps) => (<SearchForSongs {...routerProps} username={username} id_user={id_user} token={token} />)} />
        </Switch>
      </HashRouter>
    );
  }
}


export default App;

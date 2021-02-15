import './App.css';
import { useState } from 'react';
import axios from 'axios';
import _ from 'lodash';

function App() {
  const [ channelName, setChannelName ] = useState('');
  const [ minimum, setMinimum ] = useState(1000);
  const [ cloutedViewers, setCloutedViewers ] = useState([]);
  const [ isLoading, setLoading ] = useState(false);

  const API = 'https://twitch-clouted.herokuapp.com/';

  const handleSearch = () => {
    const endpoint = `${API}${channelName}?minimum=${minimum}`
    setLoading(true);
    axios({
      method: 'get',
      url: endpoint,
      headers: {'Access-Control-Allow-Origin': '*'}
    }).then(response => {
      setCloutedViewers([..._.orderBy(response.data, ['followers'], ['desc'])]);
      setLoading(false);
    }).catch(err => console.log(err));
  };

  return (
    <div style={{backgroundColor: colors.purple}} className="App">
      <header style={{margin:0, display:'flex', justifyContent:'center'}} className="App-header">
        <h1 style={{color: colors.white, margin:0, padding:'0.5em'}}>
          Twitch Clouted
        </h1>
      </header>
      <section style={{display:'flex', justifyContent:'center'}}>
          <label style={{color: colors.white, margin:'0 1em'}}>Channel Name:</label>
          <input type="text" id="channel-name" name="Channel Name" value={channelName} 
            onChange={event => setChannelName(event.target.value)}/>
          <label style={{color: colors.white, margin:'0 1em'}}>Minimum Followers: </label>
            <input type="text" id="minimum" value={minimum}
              onChange={event => setMinimum(event.target.value)}/>
      </section>
      <div style={{display:'flex', justifyContent:'center', marginTop:'1em'}}>
        <button id="submit-button" style={{ boxShadow: '0 3px 5px rgba(0, 0, 0, 0.18)', fontSize:'1em', fontWeight: 'bold', padding:'0.5em 1em',  color:colors.white, border:'none', borderRadius:5}} onClick={handleSearch}>Get Clouted Viewers</button>
      </div>
      <main>
          {
            cloutedViewers.length > 0 ? <h4 style={{color:colors.white, textAlign:'left', paddingLeft:'2em', margin:0}}>{cloutedViewers.length} Clouted Viewers</h4> : null
          }
          <div style={{display:'flex', justifyContent:'center', flexWrap: 'wrap', padding:'1em'}}>
          {
           isLoading 
            ? <img style={{display:'block'}} src="https://i.pinimg.com/originals/3f/2c/97/3f2c979b214d06e9caab8ba8326864f3.gif" alt="loader"/>
            : <>{ cloutedViewers.map((val) => <CloutedViewer key={val._id} data={val}/>) }</>
          }
          </div>
        
      </main>
    </div>
  );
}

function CloutedViewer(props) {
  // const { display_name, _id, name, partner, logo, profile_banner, url, followers, views, description } = props.data;
  const { display_name, partner, logo, profile_banner, url, followers, description } = props.data;
  
  const bannerStyle = profile_banner ? `url(${profile_banner})` : colors.black;
  
  return (<div style={{flex:1, maxWidth: 300, minWidth: 200, maxHeight: 300, backgroundColor: colors.darkPurple, margin:'5px', borderRadius:10}}>
    <div style={{padding:5, background: bannerStyle, backgroundSize: 'cover', borderRadius: '10px 10px 0 0', display:'flex', justifyContent:'center'}}>
      <a href={url} target="_blank" rel="noopener noreferrer">
        {/* <img style={{maxHeight: 100, borderRadius:'50%', display:'block', margin:'auto'}} src={logo} alt="name"/> */}
        <img style={{maxHeight: 100, borderRadius:'50%'}} src={logo} alt="name"/>
      </a>
    </div>

    <div style={{padding:20, paddingTop:0}}>
      <a style={{textDecoration:'none'}} href={url} target="_blank" rel="noopener noreferrer">
        <h4 style={{color:colors.white}}>{display_name} {partner ? VerifiedSVG : null}</h4>
      </a>
      <p style={{color:colors.white}}>{followers} followers</p>
      {description ? <p style={{color:colors.white}}>{shortenDesc(description)}</p> : null}
    </div>

  </div>);
};

function shortenDesc(desc) {
  let shortened;
  if(!desc) {
    return '';
  }
  if(desc.length < 50) {
    shortened = desc;
  } else {
    shortened = `${desc.substring(0, 50)}...`
  }
  return shortened;
}

const colors = {
  black: '#000000',
  purple: '#6441a4',
  darkPurple: '#392e5c',
  white: '#ffffff'
}

const VerifiedSVG = <svg height="10px" viewBox="0 0 496 496.01461" width="10px" xmlns="http://www.w3.org/2000/svg"><path d="m455.882812 128.003906-60.800781-27.046875-27.070312-60.824219-66.167969 6.910157-53.832031-39.039063-53.863281 39.039063-66.136719-6.910157-27.050781 60.796876-60.824219 27.074218 6.914062 66.167969-39.039062 53.832031 39.039062 53.863282-6.914062 66.136718 60.800781 27.046875 27.074219 60.824219 66.167969-6.910156 53.832031 39.039062 53.863281-39.039062 66.136719 6.910156 27.046875-60.800781 60.824218-27.070313-6.914062-66.167968 39.042969-53.832032-39.042969-53.863281zm-255.871093 216-67.921875-67.921875 22.640625-22.558593 45.28125 45.199218 135.757812-135.757812 22.640625 22.636718zm0 0" fill="#57a4ff"/><g fill="#1e81ce"><path d="m494.492188 243.308594-37.25-51.386719 6.601562-63.109375c.359375-3.449219-1.539062-6.734375-4.707031-8.144531l-57.980469-25.800781-25.800781-57.984376c-1.417969-3.160156-4.699219-5.054687-8.144531-4.710937l-63.121094 6.597656-51.382813-37.246093c-2.800781-2.03125-6.589843-2.03125-9.390625 0l-51.386718 37.246093-63.117188-6.597656c-3.441406-.328125-6.710938 1.5625-8.144531 4.703125l-25.800781 57.984375-57.984376 25.808594c-3.164062 1.40625-5.0625 4.691406-4.703124 8.136719l6.597656 63.117187-37.246094 51.386719c-2.03125 2.800781-2.03125 6.589844 0 9.390625l37.246094 51.382812-6.597656 63.121094c-.363282 3.445313 1.535156 6.734375 4.703124 8.144531l57.984376 25.800782 25.800781 57.984374c1.425781 3.148438 4.699219 5.042969 8.144531 4.710938l63.117188-6.601562 51.386718 37.25c2.800782 2.03125 6.589844 2.03125 9.390625 0l51.382813-37.25 63.121094 6.601562c3.445312.347656 6.722656-1.546875 8.144531-4.703125l25.800781-57.984375 57.980469-25.808594c3.164062-1.410156 5.0625-4.691406 4.707031-8.136718l-6.601562-63.121094 37.25-51.382813c2.035156-2.800781 2.035156-6.597656 0-9.398437zm-52 53.863281c-1.160157 1.597656-1.6875 3.566406-1.480469 5.527344l6.304687 60.382812-55.480468 24.699219c-1.8125.796875-3.265626 2.242188-4.066407 4.054688l-24.679687 55.480468-60.398438-6.3125c-1.960937-.203125-3.925781.328125-5.519531 1.488282l-49.160156 35.632812-49.167969-35.632812c-1.363281-.996094-3.003906-1.53125-4.6875-1.527344-.28125 0-.5625 0-.800781.039062l-60.402344 6.3125-24.679687-55.480468c-.804688-1.8125-2.25-3.261719-4.0625-4.066407l-55.511719-24.6875 6.304687-60.382812c.203125-1.960938-.324218-3.929688-1.480468-5.527344l-35.632813-49.167969 35.632813-49.167968c1.15625-1.597657 1.683593-3.566407 1.480468-5.527344l-6.304687-60.386719 55.480469-24.695313c1.8125-.796874 3.261718-2.242187 4.0625-4.054687l24.679687-55.480469 60.402344 6.3125c1.957031.195313 3.921875-.335937 5.519531-1.488281l49.167969-35.632813 49.167969 35.632813c1.59375 1.15625 3.558593 1.683594 5.519531 1.488281l60.398437-6.3125 24.679688 55.480469c.804687 1.8125 2.253906 3.257813 4.066406 4.0625l55.480469 24.6875-6.304688 60.386719c-.207031 1.960937.320313 3.929687 1.480469 5.527344l35.628906 49.167968zm0 0"/><path d="m341.425781 157.308594c-3.125-3.125-8.1875-3.125-11.3125 0l-130.101562 130.101562-39.625-39.550781c-3.121094-3.113281-8.175781-3.113281-11.296875 0l-22.679688 22.542969c-1.503906 1.5-2.351562 3.539062-2.351562 5.664062s.847656 4.164063 2.351562 5.664063l67.921875 67.921875c3.121094 3.121094 8.1875 3.121094 11.3125 0l158.398438-158.402344c3.121093-3.121094 3.121093-8.1875 0-11.3125zm-141.414062 175.382812-56.601563-56.601562 11.3125-11.285156 39.640625 39.558593c3.121094 3.117188 8.179688 3.117188 11.304688 0l130.101562-130.089843 11.328125 11.328124zm0 0"/></g></svg>;

export default App;

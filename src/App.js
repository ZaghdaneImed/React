import React, { Component } from 'react';
import base from './base';

// Composant fonctionnel
function Hobby(props) {
  const liStyle = {
    backgroundColor: props.index % 2 === 0 ? 'lightpink' : 'red'
  };
    return(
      <li style={liStyle} onClick={() => props.HobbyWasClicked(props.hobbyName)}>
        {props.hobbyName}
      </li>
    )
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hobbies : [],
      input: "",
      hobbyWasDeleted: false,
      page:0
    };
  }

  getRequest1() {
    console.log("--- GETTING DATA ---");
				   fetch('http://localhost:8080/api/restaurants?page='+this.state.page)
				   .then(response => {
				   console.log(response);
					 return response.json();
				   })
				   .then(data => {
					 console.log(data.data);
					 this.setState({hobbies:data.data});

				   }).catch(err => {
					 console.log("erreur dans le get : " + err)
				   });
  }

  componentWillMount() {
    //alert("toto")
    // this runs right before the <App> is rendered
    this.getRequest1();
    this.ref = base.syncState("hobbies", {
      context: this,
      state: 'hobbies'
    });

  }


  componentWillUnmount() {
    base.removeBinding(this.ref);
  }

  addHobby() {
    //alert("addHobby: " + this.state.input);

    /* OLD VERSION WITH ARRAY
    const oldHobbies = this.state.hobbies;
    this.setState({
      hobbies: oldHobbies.concat(this.state.input),
      input : ""
    });
    */
      const hobbies = {...this.state.hobbies};

        // add in our new hobby
        const timestamp = Date.now();
        hobbies[`hobby-${timestamp}`] = this.state.input;

        this.setState({hobbies});

        console.log(this.state.hobbies)
  }

  envoieRequeteFetchDelete(id) {
					let url = 'http://localhost:8080/api/restaurants/' + id;
              fetch(url, {
                  method: "DELETE",
              })
              .then(responseJSON => {
                  responseJSON.json()
                  })
                  .catch(function (err) {
                      console.log(err);
              });
          }

	supprimerRestaurant(id) {
					//var id = event.target.id;
					console.log("on supprime le restaurant id=" + id);
          this.removeHobby(id)
					this.envoieRequeteFetchDelete(id);

					// On affiche le tableau Ã  jour
					this.getRequest1();
	}



  removeHobby(key) {
    /* OLD VERSION WITH ARRAYS
    const oldHobbies = this.state.hobbies;
    const position = oldHobbies.indexOf(hobby);
    this.setState({
      hobbies: oldHobbies.filter(
        (el, index) => {
          return (index !== position)
        }
      ),

      hobbyWasDeleted : true
     } );
     */

        // Take a copy of our fishes
        const hobbies = {...this.state.hobbies};

        // Remove the fish that has the key passed as parameter
        //delete fishes[key]; // does not work because of firebase ?
        hobbies[key] = null;

        // set state
        //this.setState({fishes: fishes});
        // in ES6 you can use only 'fishes'
        this.setState({hobbies});
  }

  inputChanged(event) {
    let value = event.target.value;
    this.setState({
      input: value
    })
  }

  nextResto(){
    this.state.page = this.state.page + 1;
    this.getRequest1();
  }

  prevResto(){
    if(this.state.page != 0){
    this.state.page = this.state.page - 1;
    this.getRequest1();
  }
  }

  render() {
    let list = this.state.hobbies.map((restaurant, index) => {
      const hobby = this.state.hobbies[index];
      const liStyle = {
        backgroundColor: index % 2 === 0 ? 'lightpink' : 'Highlight'
      };
      const trStyle = {
          padding: "8px",
          textAlign: "left",
          borderBottom: "1px Solid #ddd",
          ':hover': {
            backgroundColor: '#f5f5f5'
          }
      };

      const tdStyle = {
          padding: "8px",
          textAlign: "left",
          borderBottom: "1px Solid #ddd",
          backgroundColor: index % 2 === 0 ? 'lightpink' : 'Highlight',
          width: "50%"
      };
      //return <li key={index} style={liStyle}  onClick={() => this.removeHobby(index)}>{restaurant.name}</li>
      return <tr key={index} style={trStyle}>
                <td  style={tdStyle}  onClick={() => this.removeHobby(index)}>
                    {restaurant.name}
                </td>
                <td  style={tdStyle}  onClick={() => this.removeHobby(index)}>
                    {restaurant.cuisine}
                </td>
             </tr>
    })

    /* Ancienne version avec ARRAY
    let list = this.state.hobbies.map(
      (el, index) => {
        const liStyle = {
          backgroundColor: index % 2 === 0 ? 'lightpink' : 'red'
        };
        return <li key={el+index} style={liStyle} index={index} onClick={() => this.removeHobby(el)}>{el}</li>
      }
    );

    let listComponents = this.state.hobbies.map(
      (el, index) => {

        return <Hobby key={index}
        index={index}
        HobbyWasClicked={this.removeHobby.bind(this)}
        hobbyName={el}/>
      }
    );
*/
let listComponents = Object.keys(this.state.hobbies).map((key, index) => {
  const hobby = this.state.hobbies[key];

  const liStyle = {
    float: "left",
    position:"relative",
    left:"45%"
    //backgroundColor: index % 2 === 0 ? 'lightpink' : 'red'
  };
  return  <Hobby key={index}
                index={index}
                HobbyWasClicked={this.removeHobby.bind(this)}
                hobbyName={hobby}/>

})

    let hobbyDeletedParagraph;
    if(this.state.hobbyWasDeleted) {
      hobbyDeletedParagraph = <p>Hobby Deleted !</p>
    }

    const hobbyCounterStyle = {
      color: (this.state.hobbies.length <= 3) ? "green" : "red"
    }

    const appStyle = {
      paddingLeft: "20px"
    }

    const tabStyle = {
        borderCollapse: "collapse",
        width: "100%",
        padding: "8px",
        textAlign: "left",
        borderBottom: "1px Solid #ddd",
    }

    const trStyle = {
        padding: "8px",
        textAlign: "left",
        borderBottom: "1px Solid #ddd",
        ':hover': {
          backgroundColor: '#f5f5f5'
        }
    }

    const aaStyle = {
      backgroundColor: "#333333",
      color: "white",
      height: "20px",
      overflow: "hidden",
      padding: "12px"
    }

    const ulStyle ={
          listStyleType: "none",
          margin: "0",
          padding: "0",
          overflow: "hidden",
          backgroundColor: "#333333",
          textAlign: "center"
      };

    const aStyle = {
          display: "block",
          color: "white",
          textAlign: "center",
          padding: "16px",
          textDecoration: "none"
      };

      const liStyle = {
        float: "left",
        position:"relative",
        left:"45%"
        //backgroundColor: index % 2 === 0 ? 'lightpink' : 'red'
      };
    //tr:hover{background-color:#f5f5f5}

    const hobbyCounterClass = (Object.keys(this.state.hobbies).length > 3) ? "redBorder" : ""
    return (
      <div className="App" style={appStyle}>
      <h3>My Restaurants:</h3>

        <p style={hobbyCounterStyle} className={hobbyCounterClass}> Restaurants : {Object.keys(this.state.hobbies).length}</p>



        <table className="table" style={tabStyle}>
                <thead>
                    <tr className="header" style={trStyle}>
                        <th  style={aaStyle}>
                            <div>
                                <a>Nom Du Restaurant</a>
                            </div>
                        </th>
                        <th  style={aaStyle}>
                            <div>
                                <a>Cuisine</a>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {list}
                </tbody>
            </table>
        <ul style={ulStyle}>
                    <li style={liStyle}>
                        <a style={aStyle} href="#" onClick={this.prevResto.bind(this)}>
                        Prec
                        </a>
                    </li>

                    <li style={liStyle}>
                        <a style={aStyle} href="#" onClick={this.nextResto.bind(this)}>
                            Next
                        </a>
                    </li>
        </ul>

        <p>Avec composant séparé</p>
        <ul>

        </ul>
       </div>
    );
  }
}

export default App;

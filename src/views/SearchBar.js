import React, { useState } from "react";
import { MDBCol, MDBIcon } from "mdbreact";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";

import '../assets/css/searchbar.css';

const SearchBar = () => {
    const [search, setSearch] = useState(null);

    const handleChange = (e) => {
        setSearch(e.target.value);
    }

    const handleSubmit = async () => {
        console.log(search);
        // await axios.get('http://localhost:4000/getBlock', {
        //     data: search,
        // })
        // .then((res) => {
        //     console.log(res);
        // })
    }

    return (
        <div className="search-box">
            <input
            className="search-input"
            type="text"
            placeholder="Search By Blockindex, Hash..."
            aria-label="Search"
            onChange={handleChange}
            onKeyPress={(e) => {
                if (e.key == "Enter") handleSubmit()
            }}
            />
            <div className="icon-box">
                <span className="search-icon-area">
                    <FontAwesomeIcon icon={faSearch} className="search-icon" onClick={handleSubmit}/>
                </span>
            </div>
        </div>
    );
};

export default SearchBar;
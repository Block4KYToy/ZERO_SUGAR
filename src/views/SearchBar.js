import React, { useState } from "react";
import { MDBCol, MDBIcon } from "mdbreact";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import { useHistory } from "react-router-dom";

import '../assets/css/searchbar.css';
import SuggestionBar from "./SuggestionBar";

const SearchBar = ({ allData }) => {
    let history = useHistory();
    const [search, setSearch] = useState(null);
    const [filteredData, setFilteredData] = useState(allData);
    const [searchData, setSearchData] = useState([]);

    const handleSearch = (e) => {
        // console.log(allData[0])
        setSearch(e.target.value);
        let value = e.target.value.toLowerCase();
        // console.log(value);
        let result = [];
        let filtered = [];
            // console.log(value);
        if (value!=="") {
            result = allData[0].filter((data) => {
                if (data.index == parseInt(value) || data.hash == value) return data;
            })
            if (value.length > 1) {
                filtered = allData[0].filter((data) => {
                    if (String(data.index).startsWith(String(value)) || data.hash.startsWith(value)) return data;
                })
            }
        };
        filtered = filtered.slice(0,5);
        setFilteredData(result);
        setSearchData(filtered);
    }


    // const handleChange = (e) => {
    // }

    const handleSubmit = () => {
        if (filteredData.length === 1) history.push(`/admin/block/${search}`);
        else alert("해당 검색정보가 존재하지 않습니다.");
    }

    return (
        <>
            <div className="search-box">
                <input
                className="search-input"
                type="text"
                placeholder="Search By Blockindex, Hash..."
                aria-label="Search"
                onChange={handleSearch}
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
            <SuggestionBar searchData={searchData}/>
        </>
    );
};

export default SearchBar;
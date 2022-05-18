import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

const SuggestionBar = ({searchData}) => {
    let history = useHistory();
    const changeStyle = (e) => {
        let eventTarget = e.target.nextElementSibling != null ? e.target.nextElementSibling : e.target.previousElementSibling;
        e.target.style.fontWeight = "600";
        e.target.style.fontSize = "1.25rem";
        eventTarget.style.fontWeight = "600";
        eventTarget.style.fontSize = "1.25rem";
    }

    const rewindStyle = (e) => {
        let eventTarget = e.target.nextElementSibling != null ? e.target.nextElementSibling : e.target.previousElementSibling;
        e.target.style.fontWeight = "500";
        e.target.style.fontSize = "1.125rem";
        eventTarget.style.fontWeight = "500";
        eventTarget.style.fontSize = "1.125rem";
    }

    const routeBlock = (index) => {
        history.push(`/admin/block/${index}`)
        // window.location.href = `/admin/block/${index}`;
    }

    return (
        <>
            <div className='suggestion-box'>
                <div className='suggestion-inner'>
                    { searchData.length > 0
                    ? <Row className="sug-row">
                      <Col lg={2} className="sug-col-header" >index</Col>  
                      <Col lg={10} className="sug-col-header" >hash</Col>  
                    </Row>
                    : null
                    }
                    { searchData.map((data) => 
                        <Row 
                            className="sug-row" 
                            // onMouseOver={changeStyle} 
                            // onMouseOut={rewindStyle}
                            onClick={() => routeBlock(data.index)}
                        >
                            <Col lg={2} className="sug-col">{data.index}</Col>
                            <Col lg={10} className="sug-col">{data.hash.slice(0,20) + '.....' + data.hash.slice(data.hash.length-20)}</Col>
                        </Row>                                        
                    )}
                </div>
            </div>
        </>
    )
}

export default SuggestionBar
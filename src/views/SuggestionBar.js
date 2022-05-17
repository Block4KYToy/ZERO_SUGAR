import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

const SuggestionBar = ({searchData}) => {
    let history = useHistory();
    const changeStyle = (e) => {
        e.target.style.fontWeight = "600";
        e.target.style.fontSize = "1.25rem";
    }

    const rewindStyle = (e) => {
        e.target.style.fontWeight = "500";
        e.target.style.fontSize = "1.125rem";
    }

    const routeBlock = (e) => {
        console.log(e.target.innerHTML);
        let userRoute = e.target.innerHTML
        let routeBlockIndex = searchData.filter((data) => 
            data.index == userRoute || data.hash == userRoute
        )[0].index;
        // console.log(routeBlockIndex);
        history.push(`/admin/block/${routeBlockIndex}`);
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
                            onMouseOver={changeStyle} 
                            onMouseOut={rewindStyle}
                            onClick={routeBlock}
                        >
                            <Col lg={2} className="sug-col">{data.index}</Col>
                            <Col lg={10} className="sug-col">{data.hash}</Col>
                        </Row>                                        
                    )}
                </div>
            </div>
        </>
    )
}

export default SuggestionBar
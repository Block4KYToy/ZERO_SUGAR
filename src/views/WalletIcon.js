import React, { useState } from 'react';
// import Modal from './Modal';


const WalletIcon = ({modalOpen}) => {

    return (
        <>
        <img 
            className="main-icon" 
            src="https://search.pstatic.net/common/?src=http%3A%2F%2Fblogfiles.naver.net%2FMjAyMDEwMTlfMTUg%2FMDAxNjAzMTExNzg2NTEz.0L6n4hhkDM6JD7ugFk0le6JkFNobbKRuqEpUQttUg3Eg.yzwsCaXGa8gk6j4uSvpMj-THZuZj7FQD0vflPB0yzyMg.JPEG.ekthaektha36%2FE4CE9586-B336-4128-B74B-37C8DB2A57E4.jpeg&type=sc960_832" 
            onClick={modalOpen}    
        />
        {/* <Modal modalOpen={modalOpen} close={closeModal}/> */}
        </>
    )
}

export default WalletIcon
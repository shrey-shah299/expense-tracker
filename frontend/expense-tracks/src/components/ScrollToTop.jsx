import React from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
function ScrollToTop(){
    const {pathname}=useLocation();

    useEffect(()=>{
        window.scrollTo(0,0);

        const scrollContainer=document.querySelector('.overflow-auto');
        if(scrollContainer){
            scrollContainer.scrollTop=0;
        }
    },[pathname]);
    return null;
}

export default ScrollToTop;
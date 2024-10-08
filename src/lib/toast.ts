import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"

export function showError(str: string){

  Toastify({

    text: str,
    duration: 9000,
    close: false,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    className: 'toast toast-error',
    style: {
      background: 'radial-gradient(at left top, #FF0165, #ff6363)',
      boxShadow: '0 8px 32px 0 rgba( 31, 38, 135, 0.37 )',
      borderRadius: '0.2rem',
      zIndex: '3000'
    },
    onClick: function(){} // Callback after click

  }).showToast();

}


export function showNote(str: string, close?: boolean){

  Toastify({

    text: str,
    duration: 3000,
    close: !!close,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    className: 'toast toast-note',
    style: {
      background: 'radial-gradient(at left top, rgb(21 21 21), rgb(56 56 56))',
      boxShadow: '0 8px 32px 0 rgba( 31, 38, 135, 0.37 )',
      borderRadius: '0.2rem',
      zIndex: '3000',
      color: '#eaeaea',
    },
    onClick: function(){} // Callback after click

  }).showToast();

}

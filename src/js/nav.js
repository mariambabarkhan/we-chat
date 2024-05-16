picCode = `
  <div class="container">
  <a class="navbar-brand" href="/index.html"><img src="images/logo.png" alt="WeChat"></a>

  <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <input type="checkbox" name="toggle-menu" id="toggle-menu">
    <label for="toggle-menu" type="button" class="toggle-btn">
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
    </label>

  </button>
`

navBar1 =`
<div class="collapse navbar-collapse" id="navbarSupportedContent">
  <ul class="navbar-nav ms-auto mb-2 mb-lg-0 mx-4">
    <li class="nav-item">
      <a id='home' class="nav-link" href="/index.html" >Home</a>
    </li>
    <li class="nav-item">
      <a id='contact' class="nav-link" href="/contact" style="margin-right:35px;">Contact</a>
    </li>


    <li class="dropdown">
    <a href="javascript:void(0)" class="dropbtn">
    <div class="profile">
    <img src="images/profile.png" alt="profile" class="profPic"></div>
    </a>
      <div class="dropdown-content">
        <a href="signup.html">Sign Up</a>
        <a href="/logout">Logout</a>
      </div>
    </li>



  </ul>
</div>
</div>
`
navBarCode = picCode + navBar1;


footerCode=`
<div class="footerMain">

  <div class="row">
    <div class='col d-flex justify-content-center'>
    <i class="fa" id="chevron">
      <div class="triangle-up">
      <svg xmlns="http://www.w3.org/2000/svg" id="up" viewBox="0 0 24 24" width="512" height="512"><path d="M6.414,15.586H17.586a1,1,0,0,0,.707-1.707L12.707,8.293a1,1,0,0,0-1.414,0L5.707,13.879A1,1,0,0,0,6.414,15.586Z"/></svg>
        </i>
      </div>
    </div>
  </div>

  <div class="row m-2">
    <div class="col-md-5 my-3 offset-md-1">
      <div class="d-flex my-2">
        <div class="svgBtn">
          <svg xmlns="http://www.w3.org/2000/svg" id="Filled" viewBox="0 0 24 24"
              width="512" height="512">
              <path
                  d="M23.954,5.542,15.536,13.96a5.007,5.007,0,0,1-7.072,0L.046,5.542C.032,5.7,0,5.843,0,6V18a5.006,5.006,0,0,0,5,5H19a5.006,5.006,0,0,0,5-5V6C24,5.843,23.968,5.7,23.954,5.542Z" />
              <path
                  d="M14.122,12.546l9.134-9.135A4.986,4.986,0,0,0,19,1H5A4.986,4.986,0,0,0,.744,3.411l9.134,9.135A3.007,3.007,0,0,0,14.122,12.546Z" />
          </svg>
        </div>
          <h6 class='mx-4 my-2'>mujtabashafqat0@gmail.com</h6>
      </div>

      <div class="d-flex my-2">
        <div class="svgBtn">
            <svg xmlns="http://www.w3.org/2000/svg" id="Filled" data-name="Layer 1"
                viewBox="0 0 24 24" width="512" height="512">
                <path
                    d="M23,11a1,1,0,0,1-1-1,8.008,8.008,0,0,0-8-8,1,1,0,0,1,0-2A10.011,10.011,0,0,1,24,10,1,1,0,0,1,23,11Zm-3-1a6,6,0,0,0-6-6,1,1,0,1,0,0,2,4,4,0,0,1,4,4,1,1,0,0,0,2,0Zm2.183,12.164.91-1.049a3.1,3.1,0,0,0,0-4.377c-.031-.031-2.437-1.882-2.437-1.882a3.1,3.1,0,0,0-4.281.006l-1.906,1.606A12.784,12.784,0,0,1,7.537,9.524l1.6-1.9a3.1,3.1,0,0,0,.007-4.282S7.291.939,7.26.908A3.082,3.082,0,0,0,2.934.862l-1.15,1C-5.01,9.744,9.62,24.261,17.762,24A6.155,6.155,0,0,0,22.183,22.164Z" />
            </svg>
        </div>
        <h6 class='mx-4 my-2'>0344-5028318</h6>
      </div>

      
      <div class="d-flex my-2">
          <div class="svgBtn">
            <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24" width="512" height="512"><path d="M12,.042a9.992,9.992,0,0,0-9.981,9.98c0,2.57,1.99,6.592,5.915,11.954a5.034,5.034,0,0,0,8.132,0c3.925-5.362,5.915-9.384,5.915-11.954A9.992,9.992,0,0,0,12,.042ZM12,14a4,4,0,1,1,4-4A4,4,0,0,1,12,14Z"/></svg>
          </div>
          <h6 class='mx-4 my-2'> NUST H-12 Islamabad, Pakistan
          </h6>
      </div>
    </div>
    
    
    <div class="col-md-4 offset-md-1">
      <h5 class='text-center mt-3'> WeChat<br> The ultimate chatting partner </h5>
      <label class=' mt-3'style="padding:0% 2%;"
      > WeChat is a multi-purpose messaging and video conferencing app developed by students of NUST as a part of their course project </label>
     
      <div class="d-flex justify-content-start">
        <a href="https://www.facebook.com/tajinstit" target="_blank" class="fa">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 24 24" style="enable-background:new 0 0 28 28;" xml:space="preserve" width="512" height="512">
        <g>
          <path d="M24,12.073c0,5.989-4.394,10.954-10.13,11.855v-8.363h2.789l0.531-3.46H13.87V9.86c0-0.947,0.464-1.869,1.95-1.869h1.509   V5.045c0,0-1.37-0.234-2.679-0.234c-2.734,0-4.52,1.657-4.52,4.656v2.637H7.091v3.46h3.039v8.363C4.395,23.025,0,18.061,0,12.073   c0-6.627,5.373-12,12-12S24,5.445,24,12.073z"/>
        </g>
        </svg>
        </a>
        
        <a href="https://www.instagram.com/tajinstitute/" target="_blank" class="fa">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 24 24" style="enable-background:new 0 0 24 24;" xml:space="preserve" width="512" height="512">
        <g>
          <path d="M12,2.162c3.204,0,3.584,0.012,4.849,0.07c1.308,0.06,2.655,0.358,3.608,1.311c0.962,0.962,1.251,2.296,1.311,3.608   c0.058,1.265,0.07,1.645,0.07,4.849c0,3.204-0.012,3.584-0.07,4.849c-0.059,1.301-0.364,2.661-1.311,3.608   c-0.962,0.962-2.295,1.251-3.608,1.311c-1.265,0.058-1.645,0.07-4.849,0.07s-3.584-0.012-4.849-0.07   c-1.291-0.059-2.669-0.371-3.608-1.311c-0.957-0.957-1.251-2.304-1.311-3.608c-0.058-1.265-0.07-1.645-0.07-4.849   c0-3.204,0.012-3.584,0.07-4.849c0.059-1.296,0.367-2.664,1.311-3.608c0.96-0.96,2.299-1.251,3.608-1.311   C8.416,2.174,8.796,2.162,12,2.162 M12,0C8.741,0,8.332,0.014,7.052,0.072C5.197,0.157,3.355,0.673,2.014,2.014   C0.668,3.36,0.157,5.198,0.072,7.052C0.014,8.332,0,8.741,0,12c0,3.259,0.014,3.668,0.072,4.948c0.085,1.853,0.603,3.7,1.942,5.038   c1.345,1.345,3.186,1.857,5.038,1.942C8.332,23.986,8.741,24,12,24c3.259,0,3.668-0.014,4.948-0.072   c1.854-0.085,3.698-0.602,5.038-1.942c1.347-1.347,1.857-3.184,1.942-5.038C23.986,15.668,24,15.259,24,12   c0-3.259-0.014-3.668-0.072-4.948c-0.085-1.855-0.602-3.698-1.942-5.038c-1.343-1.343-3.189-1.858-5.038-1.942   C15.668,0.014,15.259,0,12,0z"/>
          <path d="M12,5.838c-3.403,0-6.162,2.759-6.162,6.162c0,3.403,2.759,6.162,6.162,6.162s6.162-2.759,6.162-6.162   C18.162,8.597,15.403,5.838,12,5.838z M12,16c-2.209,0-4-1.791-4-4s1.791-4,4-4s4,1.791,4,4S14.209,16,12,16z"/>
          <circle cx="18.406" cy="5.594" r="1.44"/>
        </g>
        </a>
        <a  class="fa" href='/contact'>
        <svg xmlns="http://www.w3.org/2000/svg" id="Capa_1" viewBox="0 0 24 24" width="512" height="512"><path d="M5,22a2,2,0,0,0,2-2V14a2,2,0,0,0-2-2V11a7,7,0,0,1,14,0v1a2,2,0,0,0-2,2v6H14a1,1,0,0,0,0,2h5a5,5,0,0,0,2-9.576V11A9,9,0,0,0,3,11v1.424A5,5,0,0,0,5,22Z"/></svg>
        </a>
      </div>      
    </div>
  </div>
  
</div>

`

document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.triangle-up') != null){
    const scrollToTopButton = document.querySelector('.triangle-up');
    scrollToTopButton.addEventListener('click', () => {
      // Scroll to top smoothly
      window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}
});


navbar = document.querySelector('.navbar');
navbar.innerHTML+=navBarCode;

if(document.querySelector('footer') != null){
  document.querySelector('footer').innerHTML+=footerCode;
}

document.addEventListener('DOMContentLoaded', function() {
  var errorMessage = document.querySelector('.alert');
  if(errorMessage != null){
      errorMessage.classList.add('show');
      var duration = 9000; 
      setTimeout(function() {
          errorMessage.classList.remove('show');
      }, duration);
  }
});



import { useRef, useState } from 'react';
import default_image from '../Assets/default_image.svg';
import './Imagegen.css';

const Imagegen = () => {
  const [image_url, setImage_url] = useState("/");
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);




  const generateImage = async () => {
  if (inputRef.current.value.trim() === "") {
    return;
  }
  setLoading(true);

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: inputRef.current.value,
          parameters: {
            height: 1024,
            width: 1024,
            guidance_scale: 3.5,
            num_inference_steps: 50,
          },
          options: { wait_for_model: true },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const blob = await response.blob();
    const imageObjectURL = URL.createObjectURL(blob);
    setImage_url(imageObjectURL);
  } catch (error) {
    alert("Error generating image: " + error.message);
  }

  setLoading(false);
};





  // const generateImage = async () => {
  //   if (inputRef.current.value.trim() === "") {
  //     return;
  //   }
  //   setLoading(true);

  //   const response = await fetch("https://api.openai.com/v1/images/generations", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       "Authorization": "Bearer YOUR_API_KEY", // 🔐 Replace with env variable in production!
  //     },
  //     body: JSON.stringify({
  //       prompt: inputRef.current.value,
  //       n: 1,
  //       size: "512x512"
  //     }),
  //   });

  //   const data = await response.json();
  //   let data_array = data.data;
  //   setImage_url(data_array[0].url);
  //   setLoading(false);

  //   if (data && data.data && data.data[0]?.url) {
  //     setImage_url(data.data[0].url);
  //   } else {
  //     alert("Failed to generate image. Please try again.");
  //   }
  // };

  return (
    <div className='ai-image-gen'>
      <div className='header'>AI Image <span>Generator</span></div>
      <div className="img-loading">
        <div className="img">
          <img src={image_url === "/" ? default_image : image_url} alt="Generated" />
          <div className="loading">
            <div className={loading?"loading-bar-full":"loading-bar"}></div>
            <div className={loading?"loading-text":"display-none"}>Loading...</div>
          </div>
        </div>
      </div>
      <div className="search-box">
        <input
          type="text"
          ref={inputRef}
          className="search-input"
          placeholder='Describe what you want to see'
        />
        <div className="gen-button" onClick={generateImage}>
          Generate
        </div>
      </div>
    </div>
  );
};

export default Imagegen;

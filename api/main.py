
# from fastapi import FastAPI, File, UploadFile
# from fastapi.middleware.cors import CORSMiddleware
# import uvicorn
# import numpy as np
# from io import BytesIO
# from PIL import Image
# import tensorflow as tf

# app = FastAPI()

# # Allow CORS for frontend communication
# origins = [
#     "http://localhost",
#     "http://localhost:3000",
# ]
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=origins,
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # Load model - using the new .keras file for safety
# MODEL = tf.keras.models.load_model("saved_models/potato_model.keras")

# # Define class labels
# CLASS_NAMES = ["Early Blight", "Late Blight", "Healthy"]

# @app.get("/ping")
# async def ping():
#     return {"message": "Hello, I am alive"}

# # Utility: Read and convert image to NumPy array
# def read_file_as_image(data) -> np.ndarray:
#     image = Image.open(BytesIO(data)).convert("RGB")
#     image = image.resize((256, 256))  # Resize if your model expects fixed input
#     return np.array(image)

# @app.post("/predict")
# async def predict(file: UploadFile = File(...)):
#     image = read_file_as_image(await file.read())
#     img_batch = np.expand_dims(image, 0) / 255.0  # Normalize image

#     predictions = MODEL.predict(img_batch)
#     predicted_class = CLASS_NAMES[np.argmax(predictions[0])]
#     confidence = float(np.max(predictions[0]))

#     return {
#         'class': predicted_class,
#         'confidence': confidence
#     }

# if __name__ == "__main__":
#     uvicorn.run(app, host="127.0.0.1", port=8000)













from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = "saved_models/1/potatoes.h5"

# Load the model WITHOUT compiling to avoid legacy loss config errors
MODEL = tf.keras.models.load_model(MODEL_PATH, compile=False)

# Compile the model manually with supported loss and optimizer
MODEL.compile(
    optimizer=tf.keras.optimizers.Adam(),
    loss=tf.keras.losses.CategoricalCrossentropy(from_logits=False, reduction='sum_over_batch_size'),
    metrics=['accuracy']
)

CLASS_NAMES = ["Early Blight", "Late Blight", "Healthy"]

@app.get("/ping")
async def ping():
    return {"message": "Hello, I am alive"}

def read_file_as_image(data: bytes) -> np.ndarray:
    image = Image.open(BytesIO(data)).convert("RGB")
    image = image.resize((256, 256))  # Match your model input size
    return np.array(image)

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image = read_file_as_image(await file.read())
    img_batch = np.expand_dims(image, axis=0) / 255.0  # Normalize

    predictions = MODEL.predict(img_batch)
    predicted_index = np.argmax(predictions[0])
    predicted_class = CLASS_NAMES[predicted_index]
    confidence = float(np.max(predictions[0]))

    return {
        "class": predicted_class,
        "confidence": confidence
    }

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)

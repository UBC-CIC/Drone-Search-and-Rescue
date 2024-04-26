# Open Data: Aerial Drone Footage - Lost Hiker Challenge

The Lost Hiker Challenge is a project collarobrated with UBC Cloud Innovation Center to help Search and Resuce task easier. To save time for SAR teams to review drone footage manually or eye spot lost peron in the wild area, we created a dataset for machine learning model training, and also provides a trained model deployed on AWS, along with a web application.

# Deployment Guide
To deploy the service, see the DeploymentGuide.md

# User Guide
To see how to use our web app, see the UserGuide.md

# Key Directories
- `/Machine Learning/Dataset`: Includes a description of the dataset
- `/Machine Learning/Model`: Inlcudes a brief instruction and 2 Jupiter Notebooks `deploy.ipynb` and `train.ipynb` for reference.
- `/Demo.mp4`: A short demo video for how to use our web app
- `/FrontEnd/src`: All source files for web app
- `/FrontEnd/.env`: All environment variables used
- `/FrontEnd/package.json`: All dependencies required for web app with versions
- `/FrontEnd/assets`: Images used for web app
- `/BackEnd/server.py`: Source code for back-end server
- `/BackEnd/requirement.txt`: Libraries required for back-end server
- `/BackEnd/best.pt`: Fine-tunded YOLOv8n model file

# Credits
The project members are Ryan Clayton, Kaiwen Deng, James Jiang, Ruiqi Tian, Ying Qi Wen. Thanks to the advisors Panos Nasiopoulos and Junbin Zhang (Thomas) for technical supports. Special thanks to the UBC Cloud Innovation Center for AWS technical supports and this precious project idea.

# License
This project is distributed under the [MIT License](https://github.com/UBC-CIC/Drone-Search-and-Rescue/blob/main/LICENSE).


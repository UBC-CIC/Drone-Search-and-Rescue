# Deployment Guide
The service is able to be deployed on any cloud service that has enough compute power as a normal computer. We will use AWS EC2 here as an example of how to deploy the service.

## AWS EC2 configurations (If you have a VM set up, skip this section)
1. Go to your AWS EC2 page and configure a new EC2 with Ubuntu as OS. The version we tested is 22.04. You may also choose other OS, but all following steps are for Ubuntu. The instance type we have tested is a t3.xlarge (hardware configurations), but we believe smaller ones will also work, and an instance with GPU will perform better.
2. In the security tab of your EC2 instance, you need to open a new TCP port 81 besides the default port 80 for HTTP.
3. (Optional) You might also want to create an Elastic IP and attach it to your EC2 if you want to keep the public IPV4 DNS name fixed everytime you stop and relaunch the EC2 instance.
4. Make sure you have a VPC attached to your EC2, and the subnet route table is also connected to your EC2 and VPC. If you encounter any SSH connection timeout issues, this might be the reason.

## Preliminary steps
5. Launch your EC2, connect to its console via the way you prefer (e.g. SSH)
6. (Optional) Create a virtual environment if you want.
7. Make sure you have:
- **Python version of 3.10.12 or higher**
- **Node version of v20.12.2 or higher**
- **npm version of 10.5.0 or higher**
8. Clone the repository from the link in section 8.
9. Change the working directory to `FrontEnd/`
10. Run the following command to install all the packages required for the front-end. You might need sudo power.
```
npm install
```
11. Open the environment file at `FrontEnd/.env`, and replace the variable value of `REACT_APP_HOST_DNS` to your EC2 Public IPv4 DNS. You can find this in the details of your launched EC2 instance.
12. Run the following code to build the project.
```
npm run build
```
13. Change the working directory to `BackEnd/`
14. Run the following command to install packages required for the back-end.
```
pip install -r requirements.txt
```

## Run the service
15. Change the working directory to `BackEnd/`
16. Run the following command to start the server. Wait till the “Debugger is active!” appears. You might need sudo power.
```
python3 server.py
```
17. Open a new console.
18. Change the working directory to `FrontEnd/`
19. Run the following command to start the app. Wait till the local and network IPs are shown. You might need sudo power.
```
npm run dev
```
20. In a browser, paste the Public IPv4 DNS of your EC2 instance in the URL, and go to that link. The user interface should show up in a sec.
cd backend
./mvnw package -Dnative

cd ../frontend
npm run ng -- build --configuration=production
mv dist/test-webapp/* ../backend/src/main/resources/META-INF/resources/

cd ..
docker build -f backend/src/main/docker/Dockerfile.native -t test-webapp-teddy .
#use TAG env. variable to create the container with the given tag
TAG="${TAG:-latest}"

APPNAME="chatapp-demo"
NAMESPACE="aerogear"
CONTAINER="$NAMESPACE/$APPNAME:$TAG"

echo "Building docker container $CONTAINER"

docker build -t "$CONTAINER" .



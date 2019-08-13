[ -z "$CI" ] && echo "This script is meant to run only from CircleCI." && exit 1;

APPNAME="chatapp-demo"
NAMESPACE="aerogear"
CONTAINER="$NAMESPACE/$APPNAME:$TAG"

[ -z "$DOCKERHUB_USERNAME" ] && echo "Undefined DOCKERHUB_USERNAME, skipping publish" && exit 1;
docker login -u $DOCKERHUB_USERNAME -p $DOCKERHUB_PASSWORD
docker push "$CONTAINER"
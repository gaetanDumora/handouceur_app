#!/bin/bash

# Check if the number of arguments is correct
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <namespace>"
    exit 1
fi

NAMESPACE=$1
POD_NAME="$NAMESPACE-0"

# Define the path to the secrets file in the pod
REMOTE_FILE_PATH="/vault/vault-secrets.json"

# Define the local path where the file will be copied
LOCAL_FILE_PATH="./$POD_NAME-secrets.json"

# Function to check if the pod is running
wait_for_pod() {
    while true; do
        STATUS=$(kubectl get pod "$POD_NAME" -n "$NAMESPACE" -o jsonpath='{.status.phase}')
        if [ "$STATUS" = "Running" ]; then
            echo "Pod $POD_NAME is now in the 'Running' state"
            break
        fi
        echo "Waiting for pod $POD_NAME to be in the 'Running' state..."
        sleep 5 # Wait for 5 seconds before checking again
    done
}

# Wait for the pod to be in the running state
wait_for_pod

# Copy the file from the pod to the local machine
kubectl cp $NAMESPACE/$POD_NAME:$REMOTE_FILE_PATH $LOCAL_FILE_PATH

# Check if the file was copied successfully
if [ -f $LOCAL_FILE_PATH ]; then
    echo "File copied successfully to $LOCAL_FILE_PATH"

    # Remove the file from the pod
    kubectl exec -n $NAMESPACE $POD_NAME -- rm $REMOTE_FILE_PATH
    sleep 2
    if [ $? -eq 0 ]; then
        echo "File removed successfully from the pod"
    else
        echo "Failed to remove the file from the pod"
    fi
else
    echo "Failed to copy the file from the pod"
fi

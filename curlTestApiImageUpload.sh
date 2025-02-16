#!/bin/bash
# filepath: curlTestApiImageUpload.sh

# usage: ./curlTestApiImageUpload.sh --verbose /path/to/your/image.jpg

# Remove windows encoding if needed
# sed -i 's/\r//' curlTestApiImageUpload.sh

# Check for jq
check_dependencies() {
    if ! command -v jq &> /dev/null; then
        echo "Error: jq is not installed. Please install it with:"
        echo "sudo apt-get install jq"
        exit 1
    fi
}

check_dependencies

# Global verbose flag: Set to true if --verbose is passed as first argument
VERBOSE=false
if [ "$1" == "--verbose" ]; then
    VERBOSE=true
    shift
fi

# Configuration
GITHUB_TOKEN=$(gh auth token)
ENDPOINT="https://models.inference.ai.azure.com/chat/completions"
TEST_PROMPT="Generate image description in response"
PAYLOAD_FILE="payload.json"

# Determine which image file to use
if [ -z "$1" ]; then
    IMAGE_FILE="$(pwd)/sample.jpg"
else
    IMAGE_FILE="$1"
fi

# Check if the image file exists
if [ ! -f "$IMAGE_FILE" ]; then
    echo "Error: Image file '$IMAGE_FILE' not found."
    exit 1
fi

IMAGE_DATA=$(cat "$IMAGE_FILE" | base64)

# Create the base payload file (if needed)
echo '{
        "messages": [
            {
                "role": "system",
                "content": "You are a helpful assistant that describes images in details."
            },
            {
                "role": "user",
                "content": [{"text": "What''s in this image?", "type": "text"}, {"image_url": {"url":"data:image/jpeg;base64,'"${IMAGE_DATA}"'","detail":"low"}, "type": "image_url"}]
            }
        ],
        "model": "gpt-4o-mini"
    }' > "$PAYLOAD_FILE"

# Test helper function
test_model() {
    local model=$1
    local role=$2
    local use_temp=${3:-true}

    echo "Testing $model with role: $role"

    # Construct temperature params if needed
    local temp_params=""
    if [ "$use_temp" = true ]; then
        temp_params='"temperature": 1.0, "top_p": 1.0,'
    fi

    # Set tokens parameter based on model
    local tokens_param=""
    if [ "$model" = "o3-mini" ]; then
        tokens_param='"max_completion_tokens": 500,'
    else
        tokens_param='"max_tokens": 500,'
    fi

    # Create a temporary payload file for this API call
    TMP_PAYLOAD=$(mktemp)
    cat <<EOF > "$TMP_PAYLOAD"
{
    "messages": [
        {
            "role": "$role",
            "content": "You are a helpful assistant that describes images in details."
        },
        {
            "role": "user",
            "content": [
                {
                    "text": "What is in this image?",
                    "type": "text"
                },
                {
                    "image_url": {
                        "url": "data:image/jpeg;base64,$IMAGE_DATA",
                        "detail": "low"
                    },
                    "type": "image_url"
                }
            ]
        }
    ],
    $temp_params
    $tokens_param
    "model": "$model"
}
EOF

    # Make API call using the temporary payload file
    response=$(curl -s -w "\n%{http_code}" -X POST "$ENDPOINT" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $GITHUB_TOKEN" \
        --data @"$TMP_PAYLOAD")

    # Remove temporary payload file
    rm -f "$TMP_PAYLOAD"

    # Get status code and content
    http_code=$(echo "$response" | tail -n1)
    content=$(echo "$response" | sed '$d')

    # Output raw response JSON if verbose flag is true
    if [ "$VERBOSE" = true ]; then
        echo "Raw Response for $model:"
        echo "$content"
    fi

    # Check response
    if [ "$http_code" = "200" ]; then
        if [ "$model" = "DeepSeek-R1" ]; then
            echo "Debug raw content for DeepSeek:"
            echo "$content"
            completion=$(echo "$content" | jq -r '.choices[0].message.content' | sed 's/<Think>.*<\/Think>//g' | tr -d '\n' | xargs)
        else
            completion=$(echo "$content" | jq -r '.choices[0].message.content')
        fi
        echo "✓ $model test passed - Response: $completion"
    else
        echo "✗ $model test failed with code $http_code"
        echo "Response: $content"
    fi
    echo "------------------------"
}

# Verify environment
if [ -z "$GITHUB_TOKEN" ]; then
    echo "Error: GITHUB_TOKEN not set"
    exit 1
fi

# Test different model configurations
echo "Starting API tests..."

# Models with system role, no temperature
test_model "gpt-4o" "system" false
test_model "DeepSeek-R1" "user" false
test_model "o3-mini" "developer" false 

# Models with assistant role and temperature
test_model "gpt-4o-mini" "system" true
test_model "Ministral-3B" "system" true
test_model "Mistral-small" "system" true

# Phi models with system role and temperature
test_model "Phi-3.5-MoE-instruct" "system" true
test_model "Phi-3.5-mini-instruct" "system" true
test_model "Phi-4" "system" true

echo "All tests completed"
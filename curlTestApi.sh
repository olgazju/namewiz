#!/bin/bash

# Remove windows encoding if needed
# sed -i 's/\r//' test_curlTestApi.sh

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
fi

# Configuration
GITHUB_TOKEN=$(gh auth token)
ENDPOINT="https://models.inference.ai.azure.com/chat/completions"
TEST_PROMPT="Generate a one-word response"

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
        tokens_param='"max_completion_tokens": 50,'
    else
        tokens_param='"max_tokens": 50,'
    fi

    # Make API call
    response=$(curl -s -w "\n%{http_code}" -X POST "$ENDPOINT" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $GITHUB_TOKEN" \
        -d "{
            \"messages\": [
                {
                    \"role\": \"$role\",
                    \"content\": \"You are a helpful assistant. Respond with single words only. Do not explain your reasoning.\"
                },
                {
                    \"role\": \"user\",
                    \"content\": \"Give me one word: happy\"
                }
            ],
            $temp_params
            $tokens_param
            \"model\": \"$model\"
        }")

    # Get status code and content
    http_code=$(echo "$response" | tail -n1)
    content=$(echo "$response" | sed \$d)

    # Output raw response JSON if verbose flag is true
    if [ "$VERBOSE" = true ]; then
        echo "Raw Response for $model:"
        echo "$content"
    fi

    # Check response
    if [ "$http_code" = "200" ]; then
        # Debug output for DeepSeek
        if [ "$model" = "DeepSeek-R1" ]; then
            echo "Debug raw content for DeepSeek:"
            echo "$content"
            # Extract content without Think tags using sed
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
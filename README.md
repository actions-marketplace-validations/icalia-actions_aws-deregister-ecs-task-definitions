# AWS Deregister ECS Task Definitions

De-registers task definitions from AWS ECS.

## Usage

```yaml
      - name: De-register AWS ECS Task Definitions
        uses: icalia-actions/aws-deregister-ecs-task-definitions@v0.0.1
        with:
          # You can use the family name, the definition (family name + version),
          # or the full task definition ARN:
          definition: my-task-definition
```

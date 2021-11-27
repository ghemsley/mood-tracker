import React, { memo, useState } from 'react'
import type { NextPage } from 'next'
import {
  FlexboxGrid,
  Form,
  Schema,
  Rate,
  Input,
  InputPicker,
  InputNumber,
  Checkbox,
  ButtonToolbar,
  Button,
} from 'rsuite'
import { useMountedState } from 'react-use'

const model = Schema.Model({
  rating: Schema.Types.NumberType().isRequired('This field is required').min(0).max(10),
  journal: Schema.Types.StringType(),
  mood: Schema.Types.StringType().isOneOf(['happy', 'sad', 'anxious', 'angry', 'neutral']),
  meals: Schema.Types.NumberType().isInteger().min(0, 'Minimum is 0'),
  water: Schema.Types.NumberType().isInteger().min(0, 'Minimum is 0'),
  people: Schema.Types.NumberType().isInteger().min(0, 'Minimum is 0'),
  activities: Schema.Types.NumberType().isInteger().min(0, 'Minimum is 0'),
  meds: Schema.Types.BooleanType(),
  exercise: Schema.Types.BooleanType(),
})

const moodData = [
  { label: 'Happy', value: 'happy' },
  { label: 'Sad', value: 'sad' },
  { label: 'Anxious', value: 'anxious' },
  { label: 'Angry', value: 'angry' },
  { label: 'Neutral', value: 'neutral' },
]

const Textarea = React.forwardRef((props, ref) => <Input {...props} as="textarea" ref={ref} />)
Textarea.displayName = 'Textarea'

const DayFormPage: NextPage = memo(() => {
  const [rating, setRating] = useState(5)
  const [mood, setMood] = useState('neutral')
  const [meals, setMeals] = useState(0)
  const [water, setWater] = useState(0)
  const [people, setPeople] = useState(0)
  const [activites, setActivities] = useState(0)
  const [meds, setMeds] = useState(false)
  const [exercise, setExercise] = useState(false)
  const [journal, setJournal] = useState('')

  const isMounted = useMountedState()
  return (
    <FlexboxGrid justify="center">
      <FlexboxGrid.Item colspan={12}>
        <Form fluid model={model}>
          <Form.Group>
            <Form.ControlLabel>Rating</Form.ControlLabel>
            <Form.Control
              name="rating"
              accepter={Rate}
              onChange={value => {
                if (isMounted()) {
                  setRating(value)
                }
              }}
            />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>Overall mood</Form.ControlLabel>
            <Form.Control
              name="mood"
              accepter={InputPicker}
              data={moodData}
              onChange={value => {
                if (isMounted()) {
                  setMood(value)
                }
              }}
            />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>Meals eaten</Form.ControlLabel>
            <Form.Control
              name="meals"
              accepter={InputNumber}
              onChange={value => {
                if (isMounted()) {
                  setMeals(value)
                }
              }}
            />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>{'Hydration (cups)'}</Form.ControlLabel>
            <Form.Control
              name="water"
              accepter={InputNumber}
              onChange={value => {
                if (isMounted()) {
                  setWater(value)
                }
              }}
            />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>Fun activities</Form.ControlLabel>
            <Form.Control
              name="activities"
              accepter={InputNumber}
              onChange={value => {
                if (isMounted()) {
                  setActivities(value)
                }
              }}
            />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>People talked to</Form.ControlLabel>
            <Form.Control
              name="people"
              accepter={InputNumber}
              onChange={value => {
                if (isMounted()) {
                  setPeople(value)
                }
              }}
            />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>Took meds</Form.ControlLabel>
            <Form.Control
              name="meds"
              accepter={Checkbox}
              onChange={value => {
                if (isMounted()) {
                  setMeds(value)
                }
              }}
            />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>Got exercise</Form.ControlLabel>
            <Form.Control
              name="exercise"
              accepter={Checkbox}
              onChange={value => {
                if (isMounted()) {
                  setExercise(value)
                }
              }}
            />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>Journal entry</Form.ControlLabel>
            <Form.Control
              name="journal"
              accepter={Textarea}
              rows={5}
              onChange={value => {
                if (isMounted()) {
                  setJournal(value)
                }
              }}
            />
          </Form.Group>
          <Form.Group>
            <ButtonToolbar>
              <Button appearance="primary" type="submit">
                Submit
              </Button>
            </ButtonToolbar>
          </Form.Group>
        </Form>
      </FlexboxGrid.Item>
    </FlexboxGrid>
  )
})

DayFormPage.displayName = 'DayForm'

export default DayFormPage

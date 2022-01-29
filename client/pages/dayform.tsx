import React, {
  Component,
  ExoticComponent,
  FormEvent,
  FunctionComponent,
  memo,
  useEffect,
  useState,
} from 'react'
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
  Panel,
  Message,
} from 'rsuite'
import { useMountedState } from 'react-use'
import { useSelector } from 'react-redux'
import { UserObject } from '../models/user'
import { DaysType, ErrorType } from '../api/helpers'
import apiHooks from '../api'
import { isDayObject } from '../models/day.guard'
import Redirect from '../components/redirect'

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
  const user: UserObject = useSelector(state => state.user.currentUser)
  const [data, setData] = useState<any>(null)
  const [start, setStart] = useState<boolean>(false)
  const [done, setDone] = useState<boolean>(true)
  const [success, setSuccess] = useState<boolean>(false)
  const [errors, setErrors] = useState<ErrorType['errors'] | null>(null)
  const [rating, setRating] = useState(5)
  const [mood, setMood] = useState('neutral')
  const [meals, setMeals] = useState(0)
  const [water, setWater] = useState(0)
  const [people, setPeople] = useState(0)
  const [activities, setActivities] = useState(0)
  const [meds, setMeds] = useState(false)
  const [exercise, setExercise] = useState(false)
  const [journal, setJournal] = useState('')
  const isMounted = useMountedState()

  useEffect(() => {
    if (start && isMounted()) {
      setStart(false)
    }
    if (done && isDayObject(data) && isMounted()) setSuccess(true)
  }, [start, done, data, isMounted])

  apiHooks.useCreateDay(data, start, setErrors).then(([data, errors]) => {
    if (!done && (data || errors) && isMounted()) setDone(true)
  })

  const enabled = user.enabled?.split(' ')
  const labels: Record<string, string> = {
    rating: 'Rating',
    mood: 'Overall mood',
    meals: 'Meals eaten',
    water: 'Hydration (cups)',
    activities: 'Fun activities',
    people: 'People talked to',
    meds: 'Took meds',
    exercise: 'Got exercise',
    journal: 'Journal entry',
  }
  const accepters: Record<
    string,
    typeof Rate | typeof InputPicker | typeof InputNumber | typeof Checkbox | typeof Textarea
  > = {
    rating: Rate,
    mood: InputPicker,
    meals: InputNumber,
    water: InputNumber,
    activities: InputNumber,
    people: InputNumber,
    meds: Checkbox,
    exercise: Checkbox,
    journal: Textarea,
  }
  const setters: Record<string, typeof setRating | typeof setMood | typeof setMeds> = {
    rating: setRating,
    mood: setMood,
    meals: setMeals,
    water: setWater,
    activities: setActivities,
    people: setPeople,
    meds: setMeds,
    exercise: setExercise,
    journal: setJournal,
  }

  const handleSubmit = (checkStatus: any, event: FormEvent) => {
    event.preventDefault()
    if (checkStatus && done && isMounted()) {
      setData({
        rating,
        mood,
        meals: parseInt(meals),
        water: parseInt(water),
        activities: parseInt(activities),
        people: parseInt(people),
        meds,
        exercise,
        journal,
      })
      errors && setErrors(null)
      !start && setStart(true)
      setDone(false)
    }
  }

  return success ? (
    <Redirect to="/calendar" />
  ) : (
    <FlexboxGrid justify="center">
      <FlexboxGrid.Item colspan={12}>
        <Panel header={<h3>Create a new mood entry</h3>} bordered>
          {errors && errors.length > 0 && (
            <Message
              showIcon
              closable
              type="error"
              header="Error"
              onClose={event => {
                if (event && isMounted()) {
                  setErrors(null)
                }
              }}
            >
              {errors && errors.map((error, i: number) => <p key={i}>{error.message}</p>)}
            </Message>
          )}
          <Form fluid model={model} onSubmit={handleSubmit}>
            {enabled?.map((featureName: string, i: number) => (
              <Form.Group key={i}>
                <Form.ControlLabel>{labels[featureName]}</Form.ControlLabel>
                <Form.Control
                  name={featureName}
                  accepter={accepters[featureName]}
                  data={featureName === 'mood' ? moodData : undefined}
                  rows={featureName === 'journal' ? 5 : undefined}
                  onChange={(value, checked) => {
                    if (isMounted()) {
                      if (featureName !== 'meds' && featureName !== 'exercise') {
                        setters[featureName](value)
                      } else (setters[featureName] as typeof setMeds)(checked)
                    }
                  }}
                />
              </Form.Group>
            ))}
            <Form.Group>
              <ButtonToolbar>
                <Button appearance="primary" type="submit">
                  Submit
                </Button>
              </ButtonToolbar>
            </Form.Group>
          </Form>
        </Panel>
      </FlexboxGrid.Item>
    </FlexboxGrid>
  )
})

DayFormPage.displayName = 'DayForm'

export default DayFormPage

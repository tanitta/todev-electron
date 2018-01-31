import Migrator from '@/store/helpers/migrators/v0.0.1'

describe('Migrator v0.0.1', () => {
  it('should migrate correct state', () => {
    let state = {
      version: '0.0.0',
      name: 'BoardName',
      lists: {
        '1': {
          taskIds: [
            '1', '2'
          ]
        }
      },
      tasks: {
        '1': {
          name: 'task1'
        },
        '2': {
          name: 'task2'
        }
      }
    }

    let tasks = Object.keys(state.tasks).map(key => state.tasks[key])
    tasks.should.all.not.have.property('isArchived')

    Migrator.migrate(state)

    state.version.should.equal(Migrator.version)
    tasks.should.all.have.property('isArchived')
  })
})

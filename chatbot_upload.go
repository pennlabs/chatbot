//simple script to try to push changes during development

package main

import (
	"fmt"
	"os"
	"os/exec"
	"strings"
	"time"
)

const wait = 5

func main() {
	for {
		cmd := exec.Command("/bin/sh", "-c", "git pull;")
		val, _ := cmd.CombinedOutput()
		cmd.Wait()
		fmt.Println(string(val))
		if strings.Compare(string(val), "Already up-to-date.\n") != 0 {
			fmt.Println("changes detected.  Pushing...")
			cmd2 := exec.Command("/bin/sh", "-c", "git push dokku master;")
			val2, err := cmd2.CombinedOutput()
			cmd2.Wait()
			if err != nil {
				os.Exit(1)
			}
			fmt.Println(string(val2))
		}
		fmt.Println("All finished.  sleeping...")
		for i := 0; i < wait; i++ {
			go func(i int) {
				time.Sleep(time.Minute * time.Duration(i))
				fmt.Println(i, "minutes elapsed")
			}(i)
		}
		time.Sleep(time.Minute * wait)
	}
}
